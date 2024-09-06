const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/web/homeController");
const ROUTES = require("../routes");
const webAuthMiddleware = require("../../middlewares/web/authMiddleware");
const loginController = require("../../controllers/web/loginController");
const logoutController = require("../../controllers/web/logoutController");
const registerController = require("../../controllers/web/registerController");
const preventLogin = require("../../middlewares/web/preventLogin");

router.get(ROUTES.BASE, webAuthMiddleware, homeController.index);
router.get(ROUTES.LOGIN, preventLogin, loginController.index);
router.get(ROUTES.LOGOUT, logoutController.index);
router.get(ROUTES.REGISTER, preventLogin, registerController.index);

router.post(ROUTES.LOGIN, loginController.post);
router.post(ROUTES.REGISTER, registerController.post);

module.exports = router;
