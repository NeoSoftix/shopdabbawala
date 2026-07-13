// This file is a thin re-export layer. The actual implementations live in
// ./auth/* grouped by concern (registration/session, password reset, OTP).
// Kept at this path/name so existing imports (e.g. authRoutes.js) continue
// to work unchanged.

export { login, getMe, logout } from "./auth/registration.js";
export { forgotPassword, resetPassword, changedPassword } from "./auth/password.js";
export { sendOtp, verifyOtp } from "./auth/otp.js";
