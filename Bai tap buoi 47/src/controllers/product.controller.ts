import { Request, Response } from "express";
import { productService } from "../services/product.service";

export const productControler = {
  create: async (req: Request, res: Response) => {
    const product = await productService.create(req.body);
    res.status(201).json({
      success: true,
      message: "Create product success",
      data: product,
    });
  },
  findAll: async (req: Request, res: Response) => {
    const products = await productService.findAll();
    res.status(200).json({
      success: true,
      message: "Get products success",
      data: products,
    });
  },
  find: async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.find(+id!);
    res.status(200).json({
      success: true,
      message: "Get product success",
      data: product,
    });
  },
  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.update(+id!, req.body);
    res.status(201).json({
      success: true,
      message: "Update product success",
      data: product,
    });
  },
  delete: async (req: Request, res: Response) => {
    const { id } = req.params;
    await productService.delete(+id!);
    res.status(204).json({
      success: true,
      message: "Delete product success",
    });
  },
};

// POST /products: nhận body gồm name, price, description, dùng prisma.product.create để thêm mới, trả về bản ghi vừa tạo với status 201.
