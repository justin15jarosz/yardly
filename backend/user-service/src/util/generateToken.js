import crypto from "crypto";

// Generate OTP
export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Generate OTP token for URL
export function generateOTPToken(email, otp) {
  const data = `${email}:${otp}:${Date.now()}`;
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex")
    .substring(0, 32);
}
