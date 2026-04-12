import bcrypt from "bcrypt";
// export const hashPassword = (password: string) => {
//   return bcrypt.hashSync(password, 10); // tham so thu 2 : so cang lon thi cang cham (quay tron kieu loadind);
// };

// export const verifyPassword = (password: string, hash: string) => {
//   return bcrypt.compareSync(password, hash); // 2 tham so (1 la data: mat khau tho) (2 la mat khau da ma hoa)
// };
//  npm i --save-dev

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

// Xac thuc password
export const verifyPassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
