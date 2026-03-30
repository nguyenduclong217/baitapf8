import { prisma } from "../ultis/prisma";

export const productService = {
  create(productData: { name: string; price: number; description: string }) {
    return prisma.products.create({
      data: productData,
    });
  },
  findAll: () => {
    return prisma.products.findMany();
  },
  find: async (id: number) => {
    const product = await prisma.products.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      const err: any = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }
    return product;
  },

  update: async (
    id: number,
    productData: { name: string; price: number; description: string },
  ) => {
    const product = await prisma.products.findUnique({
      where: { id },
    });
    if (!product) {
      const err: any = new Error("The prosuct does not exist");
      err.statusCode = 404;
      throw err;
    }
  },

  delete: async (id: number) => {
    const product = await prisma.products.findUnique({
      where: { id },
    });

    if (!product) {
      const err: any = new Error("The prosuct does not exist");
      err.statusCode = 404;
      throw err;
    }
    return prisma.products.delete({
      where: { id },
    });
  },
};
