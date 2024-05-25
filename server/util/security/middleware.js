import session from "express-session";
import { rateLimit } from "express-rate-limit";

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});

const ipRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per 15 minutes
  message: "Too many requests from this IP. Please try again later!",
});

const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Allow 5 login attempts
  message: "Too many login attempts. Please try again later!",
});

export { sessionMiddleware, ipRateLimiter, loginRateLimiter };
