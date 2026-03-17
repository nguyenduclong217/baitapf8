// Success (res, data, message, status)
// Error (res,message, errors,status)

import { Response } from "express";
import { infoUser, LoginRequest, RegisterResponse } from "../types/user.type";

export const successResponse = (
  res: Response,
  data: RegisterResponse | LoginRequest | infoUser,
  message: string,
  status: number,
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message: string,
  errors: any,
  status: number,
) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};
