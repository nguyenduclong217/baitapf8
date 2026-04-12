import z from "zod";
// import { userService } from "../services/user.service";
export const registerSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z
    .string()
    .min(1, "Email định dạng không được để trống")
    .pipe(z.email("Email không đúng định dạng")),
  // .refine(
  //   async (email: string) => {
  //     const existing = await userService.existingEmail(email);
  //     return !existing;
  //   },
  //   { message: "Email is exist" },
  // ),
  password: z.string().min(6, "Mật khẩu phải từ 6 kí tự trở lên"),
});
