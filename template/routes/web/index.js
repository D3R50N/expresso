const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/web/homeController");
const ROUTES = require("../routes");
const webAuthMiddleware = require("../../middlewares/web/authMiddleware");
const loginController = require("../../controllers/web/loginController");
const registerController = require("../../controllers/web/registerController");
const preventLogin = require("../../middlewares/web/preventLogin");

router.get(ROUTES.WEB.INDEX, webAuthMiddleware, homeController.index);
router.get(ROUTES.WEB.LOGIN, preventLogin, loginController.index);
router.get(ROUTES.WEB.REGISTER, preventLogin, registerController.index);

router.post(ROUTES.WEB.LOGIN, loginController.post);
router.post(ROUTES.WEB.REGISTER, registerController.post);

module.exports = router;
