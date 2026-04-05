import { Request, Response } from "express";

export const homeController = {
  index: (req: Request, res: Response) => {
    const user = req.user;
    res.json({ user });
  },
};
