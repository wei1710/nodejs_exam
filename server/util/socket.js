import { Server } from "socket.io";
import { sessionMiddleware } from "./security/middleware.js";

const setupSocketIO = (server) => {
  const io = new Server(server);

  io.engine.use(sessionMiddleware);

  io.on("connection", (socket) => {
    console.log("A user connected");

    const theme = socket.request.session.theme || "dark";
    socket.emit("server-sends-theme", { theme });
    console.log(`Sent current theme to new user: ${theme}`);

    socket.on("client-sends-theme", (data) => {
      socket.request.session.theme = data.theme;
      socket.request.session.save((err) => {
        if (err) {
          console.error("Failed to save theme to session", err);
          return;
        }
        console.log(`Theme changed to: ${data.theme}`);
        io.emit("server-sends-theme", { theme: data.theme });
        console.log(`Broadcasted new theme to all users: ${data.theme}`);
      });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};

export default setupSocketIO;