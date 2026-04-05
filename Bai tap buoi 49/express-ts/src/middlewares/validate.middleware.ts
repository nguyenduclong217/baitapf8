import { NextFunction, Request, Response } from "express";

import { ZodError, ZodType } from "zod";
// const schema = z.object({
//   name: z.string().min(1, "Tên không được để trống"),
//   email: z
//     .string()
//     .min(1, "Email định dạng không được để trống")
//     .pipe(z.email("Email không đúng định dạng")),

//   password: z.string().min(6, "Mật khẩu phải từ 6 kí tự trở lên"),
// });

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

        return res.status(400).json({
          errors: zodErrors,
        });
      }
    }
  };
