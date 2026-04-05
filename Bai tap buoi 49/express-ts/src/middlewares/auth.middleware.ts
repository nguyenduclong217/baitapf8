import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.services";

// interface RequestWithUser extends Request {
//   user: {
//     name: string;
//   };
// }
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers["authorization"]?.split(" ").slice(-1).join();
  if (!token) {
    return res.status(401).json({
      message: "Token ivalid",
      success: false,
    });
  }
  const user = await authService.profile(token);
  if (!user) {
    return res.status(401).json({
      message: "Token ivalid",
      success: false,
    });
  }
  req.user = user; // cam vao req de co the goi o bat ki dau
  req.token = token;
  next();
};
