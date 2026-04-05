import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

export const validate =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const ZodErrors = Object.fromEntries(
          error.issues.map(({ path, message }) => {
            return [path[0], message];
          }),
        );

        return res.status(400).json({
          error: ZodErrors,
        });
      }
    }
  };
