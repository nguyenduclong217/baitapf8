const JWT_SECRET = process.env.JWT_SECRET as unknown as string; // ki
const JWT_EXPIRED = process.env.JWT_EXPIRED; // Thoi gian
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SERECT as unknown as string;
const JWT_REFRESH_EXPIRED = process.env.JWT_REFRESH_EXPIRED;
import jsonwebtoken from "jsonwebtoken";
// export const jwtService = {
//   // jwtService
//   // - secret key
//   // -expired

//   // openssl rand -hex 32
export const jwtService = {
  createAccessToken(userId: number) {
    // Day id vao {}
    const payload = { userId, jti: crypto.randomUUID() };
    // Tra ve ki access
    return jsonwebtoken.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRED as unknown as number,
    });
  },
  // Xac thuc accessToken
  verifyAccessToken(token: string) {
    try {
      const decoded = jsonwebtoken.verify(token, JWT_SECRET);
      return decoded;
    } catch {
      return false;
    }
  },

  // Gia ma decoded
  decodedToken(token: string) {
    return jsonwebtoken.decode(token);
  },

  // RefreshToken
  createRefreshToken(userId: number) {
    const payload = { userId, jti: crypto.randomUUID() };

    // Tra ve ki refresh
    return jsonwebtoken.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRED as unknown as number,
    });
  },

  verifyRefreshToken(token: string) {
    try {
      const decoded = jsonwebtoken.verify(token, JWT_REFRESH_SECRET);
      return decoded;
    } catch {
      return false;
    }
  },
};

//   verifiAccessToken(token: string) {
//     try {
//       const decoded = jsonwebtoken.verify(token, JWT_SECRET);
//       return decoded;
//     } catch {
//       return false;
//     }
//   },

//   decodedToken(token: string) {
//     return jsonwebtoken.decode(token);
//   },

//   // accessToken
//   createRefreshToken(userId: number) {
//     const payload = {
//       userId,
//       jti: crypto.randomUUID(),
//     };
//     return jsonwebtoken.sign(payload, JWT_REFRESH_SECRET, {
//       expiresIn: JWT_REFRESH_EXPIRED as unknown as number, // nhan number
//     });
//   },
//   verifiRefresh(token: string) {
//     try {
//       const decoded = jsonwebtoken.verify(token, JWT_REFRESH_SECRET);
//       return decoded;
//     } catch {
//       return false;
//     }
//   },
// };
