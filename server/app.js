import "dotenv/config";

import express from "express";
const app = express();

app.use(express.json());

import path from "path";
app.use(express.static(path.resolve("../client/dist")));

import livereload from "livereload";
import connectLivereload from "connect-livereload";

const liveReloadServer = livereload.createServer();
liveReloadServer.watch("..client/dist");
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 500);
});

app.use(connectLivereload());

import session from "express-session";

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

import { rateLimit } from "express-rate-limit";

// IP rate limit
const ipRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per 15 minutes
  message: "Too many requests from this IP. Please try again later!",
});

app.use(ipRateLimiter);

// Login rate limit
const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Allow 5 login attempts
  message: "Too many login attempts. Please try again later!",
});

app.use("/api/logins", loginRateLimiter);

import authsRouter from "./routers/authsRouter.js";
app.use(authsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve("../client/dist/index.html"));
});

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => console.log("Server is running on port", PORT));