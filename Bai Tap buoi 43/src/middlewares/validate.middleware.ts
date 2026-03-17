import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { errorResponse } from "../utils/response.util";

export const validate =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrors = Object.fromEntries(
          error.issues.map(({ path, message }) => {
            return [path[0], message];
          }),
        );
        return errorResponse(res, "Đã có lỗi xảy ra", zodErrors, 400);
      }
    }
  };


