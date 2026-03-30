import express from "express";
import {} from "../services/product.service";
import { productControler } from "../controllers/product.controller";
const router = express.Router();

router.post("/products", productControler.create);
router.get("/products", productControler.findAll);
router.get("/products/:id", productControler.find);
router.put("/products/:id", productControler.update);
router.delete("/products/:id", productControler.delete);

export default router;
