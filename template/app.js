const config = require("./config");
require("./src/services").init(config);

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const api_routes = require("./src/routes/api");
const web_routes = require("./src/routes/web");
const logger = require("./src/utils/logger");
const errorHandler = require("./src/middlewares/errorHandler");
const ROUTES = require("./src/routes/routes");
const cors = require("cors");
const path = require("path");

const UploadService = require("./src/services/upload");
const ClientRouterService = require("./src/services/client-router");
const LangService = require("./src/services/lang");
const RoutesService = require("./src/services/routes");
const DBService = require("./src/services/db");
const Limiter = require("./src/middlewares/limiter");
const ThemeMode = require("./src/middlewares/themeMode");
const Utils = require("./src/utils");

const app = express();

// Static Files
const buildDir = "public";
app.use(express.static(path.join(__dirname, buildDir)));

app.use(cors());
app.use(cookieParser(config.jwtSecret));
app.use(bodyParser.json({ limit: config.parserJsonLimit }));
app.use(bodyParser.urlencoded({ extended: true, limit: config.parserLimit }));

// Useful middlewares
app.use(LangService.tr);
app.use(RoutesService.router);

app.use(ThemeMode); // get user current theme mode
app.use(Limiter({ maxLimit: 5, timeDelay: Utils.toMs({ s: 2 }) })); // Limit users to 5 requests each 2s

// EJS Template Engine
app.set("view engine", "ejs");
app.set("views", "src/views");

// Routes
app.use(UploadService.router());
app.use(ROUTES.BASE, web_routes);
app.use(ROUTES.API_BASE, api_routes);

// Services
RoutesService.getAppRoutes(app);
ClientRouterService.init(app);

// Error Handling Middleware
app.use(errorHandler.e404);
app.use(errorHandler.e500);

app.listen(config.port, async () => {
  console.clear();

  if (config.setupDb) await DBService.connect();

  const address = config.isDev ? "http://localhost:" : "port ";

  RoutesService.log();
  logger.info(`Server is running on ${address}${config.port}`); //shows in console and saved in log file
});

module.exports = app;
