import "dotenv/config";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import Ws from "./ws";
import { ChatEvents } from "./data/chat";
import { onJoinChannel, onSendMessage } from "./services/chat";

async function main() {
  const port = process.env.PORT;
  const app = express();

  app.use(morgan("dev"));
  app.use(cors());

  const server = http.createServer(app);

  const ws = new Ws(server);
  ws.set(ChatEvents.JoinChannel, onJoinChannel);
  ws.set(ChatEvents.SendMessage, onSendMessage);

  ws.start();
  server.listen(port, () => {
    console.log(`😎 Servidor rodando: ${port}`);
  });
}

main().catch(console.error);
