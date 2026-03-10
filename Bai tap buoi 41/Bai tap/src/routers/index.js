const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const homeRouter = require("./home.route");

router.use(authRouter);
router.use(homeRouter);

module.exports = router;
