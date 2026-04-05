const JWT_SECRET = process.env.JWT_SECRET as unknown as string;
const JWT_EXPIRED = process.env.JWT_EXPIRED;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SERECT as unknown as string;
const JWT_REFRESH_EXPIRED = process.env.JWT_REFRESH_EXPIRED;
import jsonwebtoken from "jsonwebtoken";
export const jwtService = {
  // jwtService
  // - secret key
  // -expired

  // openssl rand -hex 32
  createAccessToken(userId: number) {
    const payload = {
      userId,
    };
    return jsonwebtoken.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRED as unknown as number, // nhan number
    });
  },
  verifiAccessToken(token: string) {
    try {
      const decoded = jsonwebtoken.verify(token, JWT_SECRET);
      return decoded;
    } catch {
      return false;
    }
  },
  decodedToken(token: string) {
    return jsonwebtoken.decode(token);
  },

  // Refresh_Token
  createRefressToken(userId: number) {
    const payload = {
      userId,
    };
    return jsonwebtoken.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRED as unknown as number,
    });
  },
  verifiRefreshToken(token: string) {
    try {
      const decoded = jsonwebtoken.verify(token, JWT_REFRESH_SECRET);
      return decoded;
    } catch {
      return false;
    }
  },
};
