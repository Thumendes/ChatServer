import "dotenv/config";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

async function main() {
  const app = express();
  const port = process.env.PORT;
  app.use(morgan("dev"));
  app.use(cors());

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Nova conexão!");
    socket.emit("me", socket.id);

    socket.on("@join-channel", ({ channel, user }) => {
      socket.join(channel);
      socket.broadcast.to(channel).emit("@user-joined", user);
    });

    socket.on("@send-message", (message) => {
      const { channel } = message;
      socket.broadcast.to(channel).emit("@new-message", message);
    });
  });

  server.listen(port, () => {
    console.log(`😎 Servidor rodando: ${port}`);
  });
}

main().catch(console.error);
