#!/usr/bin/env node

const { program } = require("commander");

const {
  promptProject,
  generateJWT,
  generateController,
  generateModel,
  generateView,
  getEnvKey,
  setEnvKey,
  deleteEnvKey,
  generate,
  generateMVC,
  generateMiddleware,
} = require("./utils");

program
  .version("1.0.0")
  .description("Node.js CLI for creating Express projects")
  .name("expresso");

program
  .command("new [project-name]")
  .description("Create a new project")
  .action(promptProject);

program
  .command("env-set <key> [value]")
  .description("Generate a env key value pair")
  .action(setEnvKey);

program
  .command("env-get [key]")
  .description("Get a env key value or all keys")
  .action(getEnvKey);

program
  .command("env-delete <key>")
  .description("Delete a env key value")
  .action(deleteEnvKey);

program
  .command("generate")
  .description("Global generate command")
  .action(generate);

program
  .command("generate:jwt")
  .description("Generate a JWT secret key")
  .action(generateJWT);

  
program
  .command("generate:mvc <name>")
  .description("Generate a Model-View-Controller")
  .action(generateMVC);

program
  .command("generate:middleware <middleware-name>")
  .description("Generate a middleware")
  .action(generateMiddleware);

  program
    .command("generate:controller <controller-name>")
    .description("Generate a controller")
    .action(generateController);

program
  .command("generate:model <model-name>")
  .description("Generate a model")
  .action(generateModel);

program
  .command("generate:view <view-name>")
  .description("Generate a view")
  .action(generateView);

program
  .command("generate:route <route-name>")
  .description("Generate a route")
  .action(generateModel);

program.parse(process.argv);
