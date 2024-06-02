const express = require("express");
const userController = require("../../controllers/api/userController");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);


module.exports = router;
