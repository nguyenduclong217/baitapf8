import { UserFindManyArgs, UserWhereInput } from "../generated/prisma/models";
import { UserQuery } from "../types/user.type";
import { prisma } from "../utlis/prisma";

export const userService = {
  findAll({ is_verified, s, page = 1, limit = 3, select = "" }: UserQuery) {
    const filters = {} as UserWhereInput;
    // const subFilter = [] as UserWhereInput[];
    if (["true", "false"].includes(is_verified)) {
      filters.is_verified = is_verified === "true";
      // subFilter.push({
      //   status: status === "true",
      // });
    }
    // if (s) {
    //   subFilter.push({
    //     name: {
    //       contains: s,
    //       mode: "insensitive",
    //     },
    //   });
    // }
    // filters.OR = subFilter;

    if (s) {
      // Tìm kiếm theo tên hoặc Email
      filters.OR = [
        {
          name: {
            contains: s,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: s,
            mode: "insensitive",
          },
        },
      ];

      // Th 2:

      // filters.name = {
      //   contains: s,
      //   mode: "insensitive",
      // };
    }

    const offset = (page - 1) * limit;
    // const selectObj = {};
    type SelectType = {
      [key: string]: boolean;
    };
    const options = {
      where: filters,
      take: limit,
      skip: offset,
      orderBy: {
        id: "desc",
      },
      include: {
        phone: true,
      },
    } as UserFindManyArgs;
    const result = select
      .trim()
      .split(",")
      .filter((item) => item)
      .reduce((acc, cur) => {
        acc[cur] = true;
        return acc;
      }, {} as SelectType);
    if (Object.keys(result).length) {
      options.select = result;
    }
    return Promise.all([
      prisma.user.findMany(
        options,
        // select: result,
      ),
      prisma.user.count({
        where: filters,
      }),
    ]);
    // return prisma.user.findMany({
    //   where: filters,
    //   take: limit,
    //   skip: offset,
    // });
  },
  async find(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error("user not fond");
    }
    return user;
  },
  create({
    // phone,
    ...userData
  }: {
    name: string;
    email: string;
    is_verified?: boolean;
    // phone?: string;
    password: string;
  }) {
    return prisma.user.create({
      data: {
        ...userData,
        created_at: new Date(),
        updated_at: new Date(),
        // phone: {
        //   create: {
        //     phone: phone!,
        //   },
        // },
      },
    });
  },
  update(
    {
      phone,
      ...userData
    }: { name: string; email: string; is_verified: boolean; phone: string },
    id: number,
  ) {
    return prisma.user.update({
      where: { id },
      data: {
        ...userData,
        phone: {
          upsert: {
            where: {
              userId: id,
            },
            create: {
              phone,
            },
            update: {
              phone,
            },
          },
        },
      },
    });
  },
  delete(id: number) {
    return prisma.$transaction([
      prisma.phone.delete({
        where: {
          userId: id,
        },
      }),
      prisma.user.delete({
        where: { id },
      }),
    ]);
    // return prisma.user.delete({
    //   where: { id },
    // });
  },
  existingEmail(email: string) {
    return prisma.user.count({
      where: { email },
    });
  },
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
};
