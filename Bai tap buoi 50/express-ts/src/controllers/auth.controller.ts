import { Request, Response } from "express";
import { authService } from "../services/auth.services";

export const authController = {
  // Register
  async register(req: Request, res: Response) {
    const data = await authService.register(req.body);
    return res.status(201).json({
      message: data.message,
    });
  },
  //Login
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: "Email or password not correct",
      });
    }
    const token = await authService.login(email, password);
    // Luu vao cookie
    res.cookie("refresh", token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.json({
      success: true,
      message: "Login success",
      accessToken: token.accessToken,
    });
  },

  // Profile
  async profile(req: Request, res: Response) {
    res.json({
      success: true,
      message: "Get user profile success",
      data: req.user,
    });
  },

  // Logout
  async logout(req: Request, res: Response) {
    const token = req.token;
    await authService.logout(token as string);
    res.json({
      success: true,
      message: "Logout success",
    });
  },

  // Refresh
  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({
        message: "RefreshToken not required",
      });
    }
    const newToken = await authService.refreshToken(refreshToken);
    if (!newToken) {
      return res.status(401).json({
        message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.",
      });
    }
    return res.json({
      message: "...",
      data: newToken,
    });
  },

  // verify Otp

  async verifyOtp(req: Request, res: Response) {
    const { otp, userId } = req.body;
    const result = await authService.verifyOtp(otp, userId);
    return res.json({
      message: result.message,
      accessToken: result.access,
    });
  },

  // Resend Otp
  async resendVerifyOtp(req: Request, res: Response) {
    const { email } = req.body;
    const result = await authService.resendVerificationEmail(email);
    return res.json({
      message: result.message,
    });
  },

  // Forgot password
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return res.json({
      message: result.message,
    });
  },
};
