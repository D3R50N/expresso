const config = require("./config/config");
require("./services").init(config);

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const api_routes = require("./routes/api");
const web_routes = require("./routes/web");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const ROUTES = require("./routes/routes");
const cors = require('cors');
const path = require("path");
const UploadService = require("./services/upload");
const ClientRouterService = require("./services/client-router");
const LangService = require("./services/lang");



const app = express();

// Static Files
const buildDir = "public";
app.use(express.static(path.join(__dirname, buildDir)));

app.use(cors());
app.use(cookieParser(config.jwtSecret));
app.use(bodyParser.json({ limit: config.parserJsonLimit }));
app.use(bodyParser.urlencoded({ extended: true, limit: config.parserLimit }));


// EJS Template Engine
app.set("view engine", "ejs"); 


// Routes
LangService.init(app);
ClientRouterService.init(app);

app.use(UploadService.router());
app.use(ROUTES.BASE, web_routes);
app.use(ROUTES.API_BASE, api_routes);

// Error Handling Middleware
app.use(errorHandler.e404);
app.use(errorHandler.e500);


app.listen(config.port, () => {
  
  // console.clear();
  
  if (config.setupDb && config.dbUri) require("./config/db");
  const address = config.isDev ? "http://localhost:" : "port ";
  logger.info(`Server is running on ${address}${config.port}`); //shows in console and saved in log file
});

module.exports = app; 
