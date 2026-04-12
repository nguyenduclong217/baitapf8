import { JwtPayload } from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utlis/hashing";
import { jwtService } from "./jwt.services";
import { userService } from "./user.service";
import { redisClient } from "../utlis/redis";
import { sendMailTemplate } from "../utlis/mail";
import { generateOtp, OTP_TLL } from "../utlis/otp";
import { prisma } from "../utlis/prisma";
// import { prisma } from "../utlis/prisma";

export const authService = {
  async register(userData: { name: string; email: string; password: string }) {
    // Password hash
    const passwordHash = hashPassword(userData.password);

    const currentUser = await userService.findByEmail(userData.email);

    if (currentUser && currentUser.is_verified) {
      throw new Error("Email đã tồn tại");
    }

    // Xac nhan user da tin tai hay chua
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        password: passwordHash,
      },
      create: {
        ...userData,
        password: passwordHash,
      },
    });
    // Tao token
    // const accessToken = await jwtService.createAccessToken(user.id);
    // Tao OTP
    const otp = generateOtp();
    await redisClient.setEx(`verify:${user.id}`, OTP_TLL, otp);
    await sendMailTemplate(
      user.email,
      "[F8-Training] Cảnh báo đăng nhập",
      "login-notice",
      { name: user.name, link: "http:F8.edu.com", otp },
    );
    // tra ve token
    return { message: "Đã gửi OTP thành công" };
  },

  // Login
  async login(email: string, password: string) {
    // Tim email
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new Error("Email or password not correct");
    }
    // Kiem tra xac thuc
    if (!user.is_verified) {
      throw new Error("The account has not been verified");
    }
    //Lay password hash
    const passwordHash = user.password;

    // Xac nhan password
    if (!verifyPassword(password, passwordHash)) {
      throw new Error("Email or password not correct");
    }
    //Tao token(access va refresh)
    const accessToken = jwtService.createAccessToken(user.id);
    const refreshToken = jwtService.createRefreshToken(user.id);

    await this.saveRefreshRedis(user.id, accessToken, refreshToken);

    //Gui email
    // await sendMailTemplate(
    //   user.email,
    //   "[F8-Training] Cảnh báo đăng nhập",
    //   "login-notice",
    //   { name: user.name, link: "http:F8.edu.com", otp: "12345" },
    // );
    return { accessToken, refreshToken };
  },

  // RefreshToken
  async saveRefreshRedis(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ) {
    const decodedAccess = jwtService.decodedToken(accessToken) as JwtPayload;
    const decodedRefresh = jwtService.decodedToken(refreshToken) as JwtPayload;

    const ttlRefresh = Math.ceil(decodedRefresh.exp! - Date.now() / 1000);

    await redisClient.setEx(
      `refreshToken:${userId}:${decodedRefresh.jti}`,
      ttlRefresh,
      JSON.stringify({
        access: decodedAccess.jti,
        refresh: decodedRefresh.jti,
        userId: userId,
      }),
    );
  },

  async refreshToken(refreshToken: string) {
    // xac thuc token
    const decoded = jwtService.verifyRefreshToken(refreshToken) as JwtPayload;
    if (!decoded) {
      return false;
    }

    // Kiem tra trong danh sanh
    const tokenFromRedis = await redisClient.get(
      `refreshToken:${decoded.userId}:${decoded.jti}`,
    );

    if (!tokenFromRedis) {
      return false;
    }

    // Lam moi
    const accessToken = jwtService.createAccessToken(decoded.userId);
    const newRefreshToken = jwtService.createRefreshToken(decoded.userId);

    // thu hoi
    await redisClient.del(`refreshToken:${decoded.userId}:${decoded.jti}`);

    // Luu token moi
    await this.saveRefreshRedis(decoded.userId, accessToken, newRefreshToken);

    // Tra ve du lieu
    return { accessToken, newRefreshToken };
  },

  // Profile
  async profile(token: string) {
    // Xac thuc token
    const decoded = (await jwtService.verifyAccessToken(token)) as JwtPayload;
    if (!decoded) {
      return false;
    }
    // Check Black list
    const blacklist = await redisClient.get(`blacklist:${decoded.jti}`);
    if (blacklist) {
      return false;
    }

    // lay ra userId
    const { userId } = decoded as JwtPayload;
    // Tim user id
    const user = await userService.find(userId);
    return user;
  },

  // Logout
  async logout(token: string) {
    //Lay thoi gian het han cua access
    const { exp, jti } = jwtService.decodedToken(token) as JwtPayload;
    const seconds = Math.ceil(exp! - Date.now() / 1000);
    await redisClient.setEx(`blacklist:${jti}`, seconds, "1"); // nhan vao 3 tham so

    // xoa access trong database
    return true;
  },

  //Verify OTP
  async verifyOtp(otp: string, userId: number) {
    const saveOtp = await redisClient.get(`verify:${userId}`);
    const failedKey = `failed_otp:${userId}`;

    if (!saveOtp) {
      throw new Error("Otp không được tìm thấy hoặc không tồn tại");
    }
    // Kiem tra so lan nhap sai
    const failedCount = await redisClient.get(failedKey);
    if (failedCount && Number(failedCount) >= 5) {
      await redisClient.del(`verify:${userId}`);
      await redisClient.del(failedKey);
      throw new Error(
        "Bạn đã nhập sai quá nhiều. Vui lòng yêu cầu gửi mã mới.",
      );
    }

    if (saveOtp !== otp) {
      await redisClient.incr(failedKey);
      await redisClient.expire(failedKey, 600);
      throw new Error("Otp không chính xác");
    }

    // Cap nhap lai is_verify
    await prisma.user.update({
      where: { id: userId },
      data: {
        is_verified: true,
      },
    });

    // Xoa Otp khoi redis
    await Promise.all([
      redisClient.del(`verify:${userId}`),
      redisClient.del(failedKey),
      redisClient.del(`resend_limit:${userId}`),
    ]);
    // tao access

    const accessToken = jwtService.createAccessToken(userId);
    return {
      message: "Xác thực tài khoản thành công",
      access: accessToken,
    };
  },

  // Resend Otp

  async resendVerificationEmail(email: string) {
    // 1.Kiểm tra email có tồn tại hoặc đã xác thực chưa
    const user = await userService.findByEmail(email);
    if (!user) throw new Error("Email không xác định");
    if (user.is_verified) throw new Error("Tài khoản đã được xác thực");

    // 2.Chống spam bằng Redis
    const rateLimitKey = `resend_limit:${user.id}`;
    const requestCount = await redisClient.incr(rateLimitKey);
    if (requestCount === 1) {
      await redisClient.expire(rateLimitKey, 60);
    }

    if (requestCount > 3) {
      throw new Error("Vui lòng thử lại sau 1 phút");
    }

    // Gửi otp
    const otp = generateOtp();
    await redisClient.setEx(`verify:${user.id}`, OTP_TLL, otp);
    await sendMailTemplate(
      user.email,
      "[F8-Training] Thông báo",
      "otp-notice",
      { name: user.name, link: "http:F8.edu.com", otp },
    );
    // tra ve token
    return { message: "Mã xác thực mới đã được gửi vào email của bạn." };
  },

  // Forgot Password
  async forgotPassword(email: string) {
    //1. Kiêm tra tồn tại của email
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new Error("Email không xác định");
    }

    // 2. Chống span
    const rateLimitKey = `resend_limit:reset:${user.id}`;
    const requestCount = await redisClient.incr(rateLimitKey);
    if (requestCount === 1) {
      await redisClient.expire(rateLimitKey, 60);
    }
    if (requestCount > 3) {
      throw new Error("Vui lòng thử lại sau 1 phút");
    }
    // 3. Tạo OTP
    const otp = generateOtp();
    await redisClient.setEx(`reset:${user.id}`, OTP_TLL, otp);
    await sendMailTemplate(
      user.email,
      "[F8-Training] Cảnh báo đăng nhập",
      "login-notice",
      { name: user.name, link: "http:F8.edu.com", otp },
    );
    return { message: "Mã khôi phục đã được gửi và email của bạn" };
  },

  //Reset Password
  async resetPassword(email: string, password: string, otp: string) {
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new Error("Email không xác định");
    }
    const failedKey = `failed_otp_reset:${user.id}`;
    // kiem tra ton tai
    const saveOtp = await redisClient.get(`reset:${user.id}`);
    if (!saveOtp) {
      throw new Error("Mã xác thực đã hết hạn hoặc không tồn tại");
    }

    // quan ly so lan nhap sai
    const failedCount = await redisClient.get(failedKey);
    if (failedCount && Number(failedCount) >= 5) {
      await redisClient.del(`reset:${user.id}`);
      await redisClient.del(failedKey);
      throw new Error(
        "Bạn đã nhập sai quá nhiều. Vui lòng yêu cầu gửi mã mới.",
      );
    }

    // so sanh otp
    if (saveOtp !== otp) {
      await redisClient.incr(failedKey);
      await redisClient.expire(failedKey, 600);
      throw new Error("Otp không chính xác");
    }
    const passwordHash = hashPassword(password);

    await prisma.$transaction([
      // Cap nhap la may khau
      prisma.user.update({
        where: { id: user.id },
        data: {
          password: passwordHash,
        },
      }),
    ]);
    // Thu hoi toan bo refresh Token o redis
    const pattern = `refreshToken:${user.id}:*`;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    // Xoa toan bo key lien quan
    await Promise.all([
      redisClient.del(`reset:${user.id}`),
      redisClient.del(`resend_limit:reset:${user.id}`),
      redisClient.del(failedKey),
    ]);
    return { message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." };
  },
};
