const express = require("express");
const authController = require("../../controllers/api/authController");
const ROUTES = require("../routes");

const router = express.Router();

router.post(ROUTES.AUTH_LOGIN, authController.login);
router.post(ROUTES.AUTH_REGISTER, authController.register);


module.exports = router;
