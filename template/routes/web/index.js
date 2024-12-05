const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/web/homeController");
const ROUTES = require("../routes");
const webAuthMiddleware = require("../../middlewares/web/authMiddleware");
const loginController = require("../../controllers/web/loginController");
const logoutController = require("../../controllers/web/logoutController");
const registerController = require("../../controllers/web/registerController");
const preventLogin = require("../../middlewares/web/preventLogin");
const UploadService = require("../../services/upload");

router.get(ROUTES.BASE, webAuthMiddleware, homeController.index);

// Client router rendering (always render homepage as there is a client router)
router.get("/about", webAuthMiddleware, homeController.index);
router.get("/faq", webAuthMiddleware, homeController.index);

// AUTH
router.get(ROUTES.LOGIN, preventLogin, loginController.index);
router.get(ROUTES.LOGOUT, logoutController.index);
router.get(ROUTES.REGISTER, preventLogin, registerController.index);


router.post(ROUTES.LOGIN, loginController.post);
router.post(ROUTES.REGISTER,UploadService.middleware.any(), registerController.post);

module.exports = router;
