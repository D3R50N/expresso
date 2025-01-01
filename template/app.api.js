const config = require("./config/config");
require("./services").init(config);

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const api_routes = require("./routes/api");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const ROUTES = require("./routes/routes");
const cors = require('cors');

const UploadService = require("./services/upload");
const RoutesService = require("./services/routes");


const app = express();

app.use(cors());
app.use(cookieParser(config.jwtSecret));
app.use(bodyParser.json({ limit: config.parserJsonLimit }));
app.use(bodyParser.urlencoded({ extended: true, limit: config.parserLimit }));


// Routes

app.use(UploadService.router("/storage/files/:filename"));
app.use(ROUTES.API_BASE, api_routes);

// Services
RoutesService.init(app);

// Error Handling Middleware
app.use(errorHandler.e404);
app.use(errorHandler.e500);


app.listen(config.port, () => {
  
  console.clear();
  
  if (config.setupDb && config.dbUri) require("./config/db");
  const address = config.isDev ? "http://localhost:" : "port ";
  
  RoutesService.log();
  logger.info(`Server is running on ${address}${config.port}`); //shows in console and saved in log file
});

module.exports = app; 
