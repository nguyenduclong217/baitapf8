import { Request, Response } from "express";
import { authService } from "../services/auth.services";

export const authController = {
  async register(req: Request, res: Response) {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Create",
      data: user,
    });
  },
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or password not correct",
      });
    }
    const token = await authService.login(email, password);
    res.status(201).json({
      success: true,
      message: "Login success",
      data: token,
    });
  },
  async profile(req: Request, res: Response) {
    return res.json({
      success: true,
      message: "Login success",
      data: req.user,
    });
  },
  async logout(req: Request, res: Response) {
    const token = req.token;
    const userId = req.user?.id;

    await authService.logout(token as string, userId as number);
    res.json({
      success: true,
      message: "Logout success",
    });
  },

  // Refresh-token
  async refreshToken(req: Request, res: Response) {
    console.log(req.body);
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }
    const tokens = await authService.refreshToken(refreshToken);
    res.status(200).json({
      success: true,
      message: "Refresh token success",
      data: tokens,
    });
  },
};
