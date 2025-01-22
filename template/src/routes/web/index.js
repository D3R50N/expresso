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
const accountMiddleware = require("../../middlewares/web/accountMiddleware");
const accountController = require("../../controllers/web/accountController");

router.get(
  ROUTES.BASE,
  webAuthMiddleware,
  accountMiddleware,
  homeController.index
);

router.get(
  ROUTES.VERIFY_ACCOUNT,
  webAuthMiddleware,
  accountController.sendVerificationMail
);
router.get(
  `${ROUTES.VERIFY_ACCOUNT}${ROUTES.FIND}`,
  webAuthMiddleware,
  accountController.verifyAccount
);

router.get(ROUTES.RESET_PASSWORD,preventLogin, accountController.passwordReset);
router.get(
  `${ROUTES.RESET_PASSWORD}${ROUTES.FIND}`,
  preventLogin,
  accountController.passwordReset
);
router.post(
  ROUTES.RESET_PASSWORD,
  preventLogin,
  accountController.sendPasswordResetMail
);
router.post(
  `${ROUTES.RESET_PASSWORD}${ROUTES.FIND}`,
  preventLogin,
  accountController.resetPassword
);

// AUTH
router.get(ROUTES.LOGIN, preventLogin, loginController.index);
router.get(ROUTES.LOGOUT, logoutController.index);
router.get(ROUTES.REGISTER, preventLogin, registerController.index);

router.post(ROUTES.LOGIN, loginController.post);
router.post(
  ROUTES.REGISTER,
  UploadService.middleware.single("image"),
  registerController.post
);

module.exports = router;
