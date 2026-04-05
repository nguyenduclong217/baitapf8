import express from "express";
import { validate } from "../middlewares/validate.middleware";
import { createProductSchema } from "../validators/product.validator";
import { productController } from "../controllers/product.controller";
const router = express.Router();

router.post(
  "/products",
  validate(createProductSchema),
  productController.create,
);
router.get("/products", productController.findAll);
router.get("/product/:id", productController.find);
router.put(
  "/product/:id",
  validate(createProductSchema),
  productController.update,
);
router.delete("/product/:id", productController.delete);

export default router;
