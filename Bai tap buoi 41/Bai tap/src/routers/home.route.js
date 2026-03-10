const express = require("express");
const homeController = require("../controller/home.controller");
const homeMiddleware = require("../middlewares/home.middleware");
const router = express.Router();

router.get("/", homeMiddleware, homeController.index);

module.exports = router;
