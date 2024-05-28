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

import http from "http";
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server);

io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
  
  // if (socket.request.session.theme) {
  //   socket.emit('server-sends-theme', { theme: socket.request.session.theme });
  // }

  socket.on("client-sends-theme", (data) => {
    console.log(socket.request.session);
    // data.theme = socket.request.session.theme;

    io.emit("server-sends-theme", data);
  });

});



import { sessionMiddleware, ipRateLimiter, loginRateLimiter } from "./util/security/middleware.js";
app.use(sessionMiddleware, ipRateLimiter);
app.use("/api/login", loginRateLimiter);

//-- --*********************************** ROUTERS *********************** --//
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