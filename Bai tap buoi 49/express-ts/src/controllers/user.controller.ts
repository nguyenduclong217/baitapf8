import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { UserQuery } from "../types/user.type";
import { postService } from "../services/post .services";

export const userController = {
  findAll: async (req: Request, res: Response) => {
    const [users, count] = await userService.findAll(
      req.query as unknown as UserQuery,
    );
    res.json({
      success: true,
      message: "Create",
      data: users,
      meta: {
        total: count,
        currentPage: req.query.page ? +req.query.page : 1,
      },
    });
  },
  find: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.find(+id!);
    res.json({
      success: true,
      message: "Create",
      data: user,
    });
  },
  create: async (req: Request, res: Response) => {
    // res.json({ body: req.body });
    const user = await userService.create(req.body);
    res.status(201).json({
      success: true,
      message: "Create",
      data: user,
    });
  },
  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.update(req.body, +id!);
    res.status(200).json({
      success: true,
      message: "Update user success",
      data: user,
    });
  },
  delete: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.delete(+id!);
    res.status(200).json({
      success: true,
      message: "Delete user success",
      data: user,
    });
  },
  createPost: async (req: Request, res: Response) => {
    const userId = req.params.id;
    const body = req.body;
    const post = await postService.create(+userId!, body);
    res.status(200).json({
      success: true,
      message: "Create post by user success",
      data: post,
    });
  },
};
