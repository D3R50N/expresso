const express = require("express");
const bodyParser = require("body-parser");
const api_routes = require("./routes/api");
const web_routes = require("./routes/web");
const config = require("./config/config");
const errorHandler = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/authMiddleware");
const User = require("./models/userModel");

const app = express();


// Static Files
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// EJS Template Engine
app.set("view engine", "ejs");

// TODO: Remove Auth Middleware Test
app.use("/protected", authMiddleware, async (req, res) => {
  var user = await User.findById(req.user.userId)
  res.send("Protected Route from " + user.email);
});

// Routes
app.use("/", web_routes);
app.use("/api", api_routes);

// Error Handling Middleware
app.use(errorHandler.e404);
app.use(errorHandler.e500);


app.listen(config.port, () => {
  if (config.setupDb && config.dbUri) require("./config/db");
  const address=config.environment=="development"?"http://localhost":"";
  console.log(`Server is running on port ${address}:${config.port}`);
});

module.exports = app;
