import { prisma } from "../utlis/prisma";

export const postService = {
  create: async (
    userId: number,
    postData: { title: string; content: string },
  ) => {
    // User co ton tai hay khong
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new Error("User not fond");
      }

      await prisma.post.create({
        data: {
          ...postData,
          userId,
        },
      });
    });
  },
};
