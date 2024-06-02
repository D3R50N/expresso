const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/web/homeController");

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.use("/home", homeController.index);

module.exports = router;
