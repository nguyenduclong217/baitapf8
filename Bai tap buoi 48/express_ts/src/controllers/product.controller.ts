import { Request, Response } from "express";
import { productService } from "../services/product.service";
import { ProductQuery } from "../types";
import { successResponse } from "../utils/response";

export const productController = {
  create: async (req: Request, res: Response) => {
    const { userId } = req.body;
    const productData = await productService.createProduct(+userId, req.body);

    return successResponse(
      res,
      { data: productData },
      "Create product success",
      201,
    );
  },

  findAll: async (req: Request, res: Response) => {
    const [users, count] = await productService.findAllProduct(
      req.query as unknown as ProductQuery,
    );

    return successResponse(
      res,
      {
        data: users,
        meta: {
          total: count,
          currentPage: req.query.page ? req.query.page : 1,
          limit: req.query.limit ? req.query.limit : 10,
        },
      },
      "Get info products",
      200,
    );
  },

  find: async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.findProduct(+id!);
    return successResponse(res, { data: product }, "Get post success", 200);
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.updateProduct(+id!, req.body);
    return successResponse(res, { data: product }, "Update user success", 200);
  },
  delete: async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.deleteProduct(+id!);
    return successResponse(res, { data: product }, "Delete user success", 200);
  },
};
