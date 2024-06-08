import { Server } from "socket.io";
import { sessionMiddleware } from "./security/middleware.js";

let currentTheme = "dark";

const setupSocketIO = (server) => {
  const io = new Server(server);

  io.engine.use(sessionMiddleware);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.emit("server-sends-theme", { theme: currentTheme });
    console.log(`Sent current theme to new user: ${currentTheme}`);

    socket.on("client-sends-theme", (data) => {
      currentTheme = data.theme;
      console.log(`Theme changed to: ${data.theme}`);

      io.emit("server-sends-theme", { theme: data.theme });

      socket.request.session.theme = data.theme;
      socket.request.session.save((error) => {
        if (error) {
          console.error("Failed to save theme to session", error);
          return;
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};

export default setupSocketIO;