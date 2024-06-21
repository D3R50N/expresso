const express = require("express");
const userController = require("../../controllers/api/userController");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/:id/get", userController.getUserById);
router.get("/:id/get/:attr", userController.getUserAttribute);

router.post("/", userController.createUser);


module.exports = router;
