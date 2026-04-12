import z from "zod";
export const createUserSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z
    .string()
    .min(1, "Email định dạng không được để trống")
    .pipe(z.email("Email không đúng định dạng")),
  password: z.string().min(6, "Mật khẩu phải từ 6 kí tự trở lên"),
});
