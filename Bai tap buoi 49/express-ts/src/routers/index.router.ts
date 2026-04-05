import express from "express";
import { homeController } from "../controllers/home.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema } from "../validatiors/auth.validate";
import { authController } from "../controllers/auth.controller";
// import { validate } from "../middlewares/validate.middleware";
// import { createUserSchema } from "../validatiors/createUser.validate";

const router = express.Router();

// router.use(authMiddleware);

// router.use(validate);
router.get("/", homeController.index);
router.post("/users", userController.create);
router.get("/users", userController.findAll);
router.get("/users/:id", userController.find);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);
router.post("/users/:id/posts", userController.createPost);
router.post(
  "/auth/register",
  validate(registerSchema),
  authController.register,
);
router.post("/auth/login", authController.login);
router.get("/auth/profile", authMiddleware, authController.profile);
router.delete("/auth/logout", authMiddleware, authController.logout);
router.post("/auth/refresh-token", authController.refreshToken);

export default router;
