const ClientRouterService = require(".");
const ClientRouterController = require("./controller");


ClientRouterService.router.get("/", ClientRouterController.index);