const express = require("express");
const authController = require("../../controllers/api/authController");
const ROUTES = require("../routes");

const router = express.Router();

router.post(ROUTES.API.AUTH.LOGIN, authController.login);
router.post(ROUTES.API.AUTH.REGISTER, authController.register);


module.exports = router;
