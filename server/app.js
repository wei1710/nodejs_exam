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

//-- --*********************************** AUTHS *********************** --//
import { sessionMiddleware, ipRateLimiter, loginRateLimiter } from "./util/security/middleware.js";

app.use(sessionMiddleware, ipRateLimiter);
app.use("/api/login", loginRateLimiter);

//-- --*********************************** SOCKET IO *********************** --//
import setupSocketIO from "./util/socket.js";

import http from "http";
const server = http.createServer(app);

setupSocketIO(server);

//-- --*********************************** ROUTERS *********************** --//
import authsRouter from "./routers/authsRouter.js";
app.use(authsRouter);

import usersRouter from "./routers/usersRouter.js";
app.use(usersRouter);

import moviesRouter from "./routers/moviesRouter.js";
app.use(moviesRouter);

import socketsRouter from "./routers/socketsRouter.js";
app.use(socketsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve("../client/dist/index.html"));
});

const PORT = process.env.SERVER_PORT;
server.listen(PORT, () => console.log("Server is running on port", PORT));