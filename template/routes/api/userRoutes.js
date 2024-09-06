const express = require("express");
const userController = require("../../controllers/api/userController");
const ROUTES = require("../routes");

const router = express.Router();

router.get(ROUTES.BASE, userController.getAllUsers);
router.get(ROUTES.FIND, userController.getUserById);
router.get(ROUTES.GET, userController.getUserById);
router.get(ROUTES.GET_ATTRIBUTE, userController.getUserAttribute);

router.post(ROUTES.BASE, userController.createUser);


module.exports = router;
