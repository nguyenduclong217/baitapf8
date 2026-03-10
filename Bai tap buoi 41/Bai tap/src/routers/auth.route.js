const express = require("express");
const router = express.Router();
const authControl = require("../controller/auth.controller");
const {
  authMiddleware,
  authMiddleware2,
} = require("../middlewares/auth.middleware");

router.get("/dang-nhap", authMiddleware2, authControl.index);
router.post("/dang-nhap", authMiddleware, authControl.login);
router.get("/logout", authControl.logout);

module.exports = router;
