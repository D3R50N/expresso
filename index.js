const { program } = require("commander");
const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");
const process = require("process");

program
  .version("1.0.0")
  .description("Node.js CLI for creating Express projects")
  .name("expresso");

program
  .command("new [project-name]")
  .description("Create a new project")
  .action((projectName) => {
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
  });

program
  .command("generate-jwt-secret")
  .description("Generate a JWT secret key")
  .action(() => {
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
  });

program
  .command("env-set <key> [value]")
  .description("Generate a env key value pair")
  .action((key, value) => {
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
  });

program
  .command("env-get [key]")
  .description("Get a env key value or all keys")
  .action((key) => {
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
  });

program.parse(process.argv);

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
    ".env",
  ];

  try {
    await fs.ensureDir(projectPath);

    const templatePath = path.join(__dirname, "template");
    await fs.copy(templatePath, projectPath);

    for (let i = 0; i < files_to_replace.length; i++) {
      const filePath = path.join(projectPath, files_to_replace[i]);
      let content = await fs.readFile(filePath, "utf-8");
      for (let j = 0; j < var_to_search.length; j++) {
        content = content
          .split(`[##${var_to_search[j]}##]`)
          .join(var_to_replace[j]);
      }
      await fs.writeFile(filePath, content);
    }

    console.log(`Created project at ${projectPath}`);
  } catch (err) {
    console.error("Error creating project:", err);
  }
}
