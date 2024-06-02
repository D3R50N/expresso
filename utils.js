const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");
const process = require("process");

const generatorPath = path.join(__dirname, "generator");
const templatePath = path.join(__dirname, "template");

function toLitt(str = "", capitalize = false) {
  const asPkg = str
    .split(" ")
    .filter((v, i) => {
      return v.trim() != "";
    })
    .join("-")
    .split("-")
    .join("_");

  var name = asPkg;
  var name_parts = name.split("_");
  name = name_parts
    .map((v, i) => {
      if (!capitalize && i == 0) return v;
      return v.charAt(0).toUpperCase() + v.slice(1);
    })
    .join("");

  return name;
}

async function setVarInFile({ filePath, vars = [], values = [] }) {
  let content = await fs.readFile(filePath, "utf-8");
  for (let i in vars) {
    let varName = vars[i];
    let value = values[i] ?? "";
    content = content.split(`[##${varName}##]`).join(value);
  }
  await fs.writeFile(filePath, content);
}

async function createProject(projectName) {
  const projectPath = path.join(process.cwd(), projectName);
  if (!projectName) projectName = process.cwd().split(path.sep).pop();

  const PKG_NAME = projectName
    .split(" ")
    .filter((v, i) => {
      return v.trim() != "";
    })
    .join("-")
    .toLowerCase();

  var NAME = PKG_NAME;
  var parts = NAME.split("-").join("_").split("_");
  NAME = parts
    .map((v, i) => {
      return v.charAt(0).toUpperCase() + v.slice(1);
    })
    .join("");

  var configure_db = await inquirer.prompt([
    {
      type: "number",
      name: "port",
      message: "Enter port number for the server:",
      default: 3000,
    },
    {
      type: "confirm",
      name: "setup_db",
      message: "Do you want to configure database? :",
      default: false,
    },
  ]);

  var PORT = configure_db.port;
  var SETUP_DB = configure_db.setup_db;
  var DBNAME = "";
  var DBUSER = "";
  var DBPASSWORD = "";
  var DBHOST = "127.0.0.1";
  var DBPORT = "27017";

  if (SETUP_DB) {
    var db_details = await inquirer.prompt([
      {
        type: "input",
        name: "DBNAME",
        message: "Enter database name:",
        validate: function (input) {
          if (input.trim() == "") {
            return "Database name cannot be empty";
          }
          if (input.includes(" ")) {
            return "Database name cannot contain spaces";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "DBUSER",
        message: "Enter database user:",
        validate: function (input) {
          if (input.trim() == "") {
            return "Database user cannot be empty";
          }
          if (input.includes(" ")) {
            return "Database user cannot contain spaces";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "DBPASSWORD",
        message: "Enter database password:",
      },
      {
        type: "input",
        name: "DBHOST",
        message: "Enter database host:",
        default: DBHOST,
      },
      {
        type: "number",
        name: "DBPORT",
        message: "Enter database port:",
        default: DBPORT,
      },
    ]);

    DBNAME = db_details.DBNAME;
    DBUSER = db_details.DBUSER;
    DBPASSWORD = db_details.DBPASSWORD;
    DBHOST = db_details.DBHOST;
    DBPORT = db_details.DBPORT;
  }

  const var_to_search = [
    "PKG_NAME",
    "NAME",
    "PORT",
    "SETUP_DB",
    "DBHOST",
    "DBPORT",
    "DBNAME",
    "DBUSER",
    "DBPASSWORD",
  ];
  const var_to_replace = [
    PKG_NAME,
    NAME,
    PORT,
    SETUP_DB,
    DBHOST,
    DBPORT,
    DBNAME,
    DBUSER,
    DBPASSWORD,
  ];
  const files_to_replace = [
    "package.json",
    "README.md",
    "views/index.ejs",
    ".env.template",
  ];

  try {
    await fs.ensureDir(projectPath);
    await fs.copy(templatePath, projectPath);

    for (let i = 0; i < files_to_replace.length; i++) {
      const filePath = path.join(projectPath, files_to_replace[i]);
      await setVarInFile({
        filePath,
        vars: var_to_search,
        values: var_to_replace,
      });
    }

    await fs.rename(
      path.join(projectPath, ".env.template"),
      path.join(projectPath, ".env")
    );

    console.log(`Created project at ${projectPath}`);
  } catch (err) {
    console.error("Error creating project:", err);
  }
}

function promptProject(projectName) {
  if (!projectName) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "projectName",
          message: `Enter project name (default: ${process
            .cwd()
            .split(path.sep)
            .pop()}):`,
        },
      ])
      .then((answers) => {
        projectName = answers.projectName;
        createProject(projectName);
      });
  } else createProject(projectName);
}

function generateJWT() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found");
    return;
  }

  var content = fs.readFileSync(envPath, "utf-8");
  var lines = content.split("\n");
  var found = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("JWT_SECRET")) {
      found = i;
      break;
    }
  }

  if (found == -1) {
    fs.appendFileSync(
      envPath,
      `\n\nJWT_SECRET = ${require("crypto").randomBytes(64).toString("hex")}`
    );
    return;
  }

  lines[found] = `JWT_SECRET = ${require("crypto")
    .randomBytes(64)
    .toString("hex")}`;
  content = lines.join("\n");
  fs.writeFileSync(envPath, content);
}
function setEnvKey(key, value) {
  if (!value) value = "";
  key = key.toUpperCase();
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found");
    return;
  }

  var content = fs.readFileSync(envPath, "utf-8");
  var lines = content.split("\n");
  var found = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`${key}`)) {
      found = i;
      break;
    }
  }

  if (found == -1) {
    fs.appendFileSync(envPath, `\n${key} = ${value}`);
    return;
  }

  lines[found] = `${key} = ${value}`;
  content = lines.join("\n");
  fs.writeFileSync(envPath, content);
}
function getEnvKey(key) {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found");
    return;
  }
  var content = fs.readFileSync(envPath, "utf-8");
  var lines = content.split("\n");

  var obj = {};

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() == "" || lines[i].startsWith("#")) continue;
    obj[lines[i].split("=")[0].trim().toUpperCase()] = lines[i]
      .split("=")[1]
      ?.trim();
  }

  console.log(key ? obj[key.toUpperCase()] ?? "Key not found" : obj);
}
function deleteEnvKey(key) {
  key = key.toUpperCase();
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found");
    return;
  }

  var content = fs.readFileSync(envPath, "utf-8");
  var lines = content.split("\n");
  var found = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`${key}`)) {
      found = i;
      break;
    }
  }

  if (found == -1) {
    console.error("Key not found");
    return;
  }

  lines.splice(found, 1);
  content = lines.join("\n");
  fs.writeFileSync(envPath, content);
}

async function generateController(controllerName) {
  controllerName += " controller";
  controllerName = toLitt(controllerName);

  var prompt = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Select controller type:",
      choices: ["API", "Web"],
    },
  ]);

  var controllerType = prompt.type.toLowerCase();

  const controllerPath = path.join(
    process.cwd(),
    "controllers",
    controllerType,
    `${controllerName}.js`
  );

  if (fs.existsSync(controllerPath)) {
    var prompt = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Controller already exists, overwrite?",
        default: false,
      },
    ]);

    if (!prompt.overwrite) return;
  }

  const controllerTemplatePath = path.join(generatorPath, "controller.js");
  await fs.copy(controllerTemplatePath, controllerPath);
  await setVarInFile({
    filePath: controllerPath,
    vars: ["CONTROLLER_NAME"],
    values: [toLitt(controllerName, true)],
  });

  console.log(
    "Generated",
    path.join("controllers", controllerType, controllerName + ".js")
  );
}

module.exports = {
  toLitt,
  setVarInFile,
  promptProject,
  generateJWT,
  setEnvKey,
  getEnvKey,
  deleteEnvKey,
  generateController,
};
