import z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Tên tối thiểu 2 kí tự"),
  desc: z.string(),
  price: z
    .number()
    .min(1, "Giá không được để trống")
    .gt(0, "Giá phải lớn hơn 0"),
  stock: z.number().min(0).optional().default(0),
  userId: z.number().min(1, "Id không được để trống"),
});
