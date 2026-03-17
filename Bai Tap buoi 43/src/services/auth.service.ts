import express from "express";
import fs from "fs";
import path from "path";
import { LoginRequest, RegisterResponse, User } from "../types/user.type";

// Lay duong dan

const filePath = path.join(process.cwd(), "src", "data", "user.json");

console.log(filePath);

export const registerService = (data: RegisterResponse): User => {
  // Đọc -> kiểm tra -> Tạo -> Thêm-> Ghi

  const filedata = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const users: User[] = filedata;

  const exitstedUser = users.find((user) => user.email === data.email);

  if (exitstedUser) {
    throw new Error("Email đã tồn tại");
  }

  const maxId = users.length ? Math.max(...users.map((u) => u.id)) : -1;
  const newId = maxId + 1;
  const newUser: User = {
    id: newId,
    email: data.email,
    password: data.password,
    fullname: data.fullname,
  };

  users.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  return newUser;
};

export const loginService = (data: LoginRequest) => {
  const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const users: User[] = fileData;

  const exitstedUser = users.find((user) => user.email === data.email);

  if (!exitstedUser || exitstedUser.password !== data.password) {
    throw new Error("Tài khoản hoặc mật khẩu chưa chính xác");
  }
  return {
    id: exitstedUser.id,
    fullname: exitstedUser.fullname,
    email: exitstedUser.email,
  };
};
