const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/web/homeController");

router.get("/", homeController.index);

module.exports = router;
