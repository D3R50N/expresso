const express = require("express");
const bodyParser = require("body-parser");
const api_routes = require("./routes/api");
const web_routes = require("./routes/web");
const config = require("./config/config");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// EJS Template Engine
app.set("view engine", "ejs");

// Routes
app.use("/", web_routes);
app.use("/api", api_routes);

// Error Handling Middleware
app.use(errorHandler);

app.listen(config.port, () => {
  if (config.setupDb && config.dbUri) require("./config/db");
  console.log(`Server is running on port ${config.port}`);
});

module.exports = app;
