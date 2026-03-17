import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { createUserZod, loginAccount } from "../schemas/auth.schema";

const router = express.Router();

router.post("/register", validate(createUserZod), registerController);
router.get("/login", validate(loginAccount), loginController);

export default router;
