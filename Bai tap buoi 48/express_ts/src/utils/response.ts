// Success (res, data, message, status)
// Error (res,message, errors,status)

import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string,
  status: number,
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = <T>(
  res: Response,
  message: string,
  errors: T,
  status: number,
) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};
