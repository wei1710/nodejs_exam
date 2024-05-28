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
  console.log("A user connected");

  const theme = socket.request.session.theme || "dark";
  socket.emit("server-sends-theme", { theme });
  console.log(`Sent current theme to new user: ${theme}`);

  socket.on("client-sends-theme", (data) => {
    socket.request.session.theme = data.theme;
    socket.request.session.save(err => {
      if (err) {
        console.error('Failed to save theme to session', err);
        return;
      }
      console.log(`Theme changed to: ${data.theme}`);
      // Emit the new theme to all connected clients
      io.emit("server-sends-theme", { theme: data.theme });
      console.log(`Broadcasted new theme to all users: ${data.theme}`);
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
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

import socketRouter from "./routers/socketRouter.js";
app.use(socketRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve("../client/dist/index.html"));
});

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => console.log("Server is running on port", PORT));