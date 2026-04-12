import crypto from "crypto";

export const OPT_LENGTH = 6;
export const OTP_TLL = 6000;

export const generateOtp = (): string => {
  return crypto.randomInt(0, 1_000_000).toString().padStart(OPT_LENGTH, "0");
};
