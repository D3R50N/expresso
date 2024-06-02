#!/usr/bin/env node

const { program } = require("commander");

const {
  promptProject,
  generateJWT,
  generateController,
  getEnvKey,
  setEnvKey,
  deleteEnvKey,
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
  .command("generate:jwt")
  .description("Generate a JWT secret key")
  .action(generateJWT);

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
  .command("generate:controller <controller-name>")
  .description("Generate a controller")
  .action(generateController);

program.parse(process.argv);
