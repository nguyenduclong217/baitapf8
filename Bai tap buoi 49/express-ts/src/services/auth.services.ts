import { JwtPayload } from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utlis/hashing";
// import { prisma } from "../utlis/prisma";
import { jwtService } from "./jwt.services";
import { userService } from "./user.service";
import { redisClient } from "../utlis/redis";
import { prisma } from "../utlis/prisma";

export const authService = {
  async register(userData: { name: string; email: string; password: string }) {
    //Hashing password
    const passwordHash = hashPassword(userData.password);
    // Goi userService de them vao dataBase
    const user = await userService.create({
      ...userData,
      password: passwordHash,
    });
    // Gui Email (Xac thuc)
    // Tao Token (Goi jwtService)
    const accsessToken = jwtService.createAccessToken(user.id);
    return { accsessToken };
  },

  async login(email: string, password: string) {
    // find email
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new Error("Email or password not correct"); // thuong se day sang error handeling
    }
    // lay password hash
    const passwordHash = user.password;

    // Verify password
    if (!verifyPassword(password, passwordHash)) {
      throw new Error("Email or password not correct");
    }
    // tao token
    const accsessToken = jwtService.createAccessToken(user.id);
    const refreshToken = jwtService.createRefressToken(user.id);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Luu refresh token vao database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });
    return { accsessToken, refreshToken };
  },

  async profile(token: string) {
    // verify token (jwtService)
    const decoded = jwtService.verifiAccessToken(token);
    if (!decoded) {
      return false;
    }
    // Check black list
    const blacklist = await redisClient.get(`blacklist:${token}`);
    if (blacklist) {
      return false;
    }
    const { userId } = decoded as JwtPayload;
    // Query db
    const user = await userService.find(userId);
    // Check user block khong ? verify chua?
    return user;
  },
  async logout(token: string, userId: number) {
    const { exp } = jwtService.decodedToken(token) as JwtPayload;
    // await redisClient.set(`blacklist:${token}`, 1);
    const seconds = Math.ceil(exp! - Date.now() / 1000);
    await redisClient.setEx(`blacklist:${token}`, seconds, "1");

    await prisma.refreshToken.deleteMany({ where: { userId } });
    return true;
  },

  //refresh_token
  async refreshToken(token: string) {
    // verify refresh token
    const decoded = jwtService.verifiRefreshToken(token);
    if (!decoded) {
      throw new Error("Refresh token invalid or expired");
    }

    // Kiem tra co ton tai trong database khong
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!storedToken) {
      throw new Error("Refresh token not found");
    }

    //Kiem tra xem token da het han hay chua
    if (storedToken.expiresAt <= new Date()) {
      throw new Error("Refresh token expired");
    }

    const { userId } = decoded as JwtPayload;
    // Xoa refresh token cu trong dataBase
    await prisma.refreshToken.delete({ where: { token } });

    // Tao token moi
    const newAccessToken = jwtService.createAccessToken(userId);
    const newRefreshToken = jwtService.createRefressToken(userId);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId,
        expiresAt,
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },
};
