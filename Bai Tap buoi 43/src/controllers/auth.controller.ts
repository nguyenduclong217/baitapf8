import { Request, Response } from "express";
import { loginService, registerService } from "../services/auth.service";
import { errorResponse, successResponse } from "../utils/response.util";

export const registerController = (req: Request, res: Response) => {
  try {
    const user = registerService(req.body);
    return successResponse(res, user, "Đăng kí thành công", 201);
  } catch (error) {
    return errorResponse(res, (error as Error).message, null, 500);
  }
};

export const loginController = (req: Request, res: Response) => {
  try {
    const user = loginService(req.body);
    return successResponse(res, user, "Đăng nhập thành công", 200);
  } catch (error) {
    return errorResponse(res, (error as Error).message, null, 500);
  }
};
