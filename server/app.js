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

import { sessionMiddleware, ipRateLimiter, loginRateLimiter } from "./util/security/middleware.js";
app.use(sessionMiddleware, ipRateLimiter);
app.use("/api/login", loginRateLimiter);

import authsRouter from "./routers/authsRouter.js";
app.use(authsRouter);

import usersRouter from "./routers/usersRouter.js";
app.use(usersRouter);

import moviesRouter from "./routers/moviesRouter.js";
app.use(moviesRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve("../client/dist/index.html"));
});

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => console.log("Server is running on port", PORT));