import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 min
  max: 15,    // 15 max attempts in 15 min
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: "Too many login attempts. Try again after 15 minutes.",
  },
});

export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 min max window
  max: 5,      // 5 max attempts in 15 min 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many payment requests.Please try again after some time",
  },
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min max window  
  max: 300,    // 300 max attempts in 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests.Please try again after some time",
  },
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
   standardHeaders: true,
  legacyHeaders: false,
  message:{
    success:false,
    message:"To many request.Please try again after some time"
  }
})

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
   standardHeaders: true,
  legacyHeaders: false,
  message:{
    succes:false,
    message: "Too many request. Please try again after some time"
  }
});