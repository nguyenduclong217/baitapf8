import { error } from "node:console";
import { Prisma } from "../generated/prisma/client";
import { ProductWhereInput } from "../generated/prisma/models";
import { Product, ProductQuery } from "../types";
import { prisma } from "../utils/prisma";

export const productService = {
  createProduct: async (userId: number, productData: Product) => {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error("User not found");
      }
      return await prisma.product.create({
        data: productData,
      });
    });
  },

  findAllProduct({ userId, q, page = 1, limit = 10 }: ProductQuery) {
    const filters = {} as ProductWhereInput;
    if (userId) {
      filters.userId = {
        equals: Number(userId),
      };
    }
    // tu khoa
    if (q) {
      filters.name = {
        contains: q,
        mode: "insensitive",
      };
    }

    limit = Math.min(limit, 50);
    const offset = (page - 1) * limit;

    return Promise.all([
      prisma.product.findMany({
        where: filters,
        take: limit,
        skip: offset,
      }),
      prisma.product.count({
        where: filters,
      }),
    ]);
  },

  async findProduct(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    const { user, ...rest } = product;
    return {
      ...rest,
      createdBy: user,
    };
  },

  async updateProduct(
    productId: number,
    body: { name: string; desc: string; price: number; stock: number },
  ) {
    try {
      const product = await prisma.product.update({
        where: { id: productId },
        data: {
          ...body,
          updated_at: new Date(),
        },
      });

      return product;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        const error = new Error("Product not found");
        (error as Error & { statusCode?: number }).statusCode = 404;
        throw error;
      }

      throw error;
    }
  },

  async deleteProduct(productId: number) {
    try {
      const product = await prisma.product.delete({
        where: { id: productId },
      });
      return product;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        const error = new Error("Product not found");
        (error as Error & { statusCode?: number }).statusCode = 404;
        throw error;
      }
    }
    throw error;
  },
};
