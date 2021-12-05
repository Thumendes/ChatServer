import http from "http";
import { Server, Socket } from "socket.io";
import { ChatEvents } from "./data/chat";

export type WsCallback = (socket: Socket, ...params: any[]) => void;

export type MapEvents = Partial<Record<ChatEvents, WsCallback>>;

class Ws {
  public io!: Server;
  public mapEvents: MapEvents = {};

  constructor(private server: http.Server) {}

  public set(event: ChatEvents, callback: WsCallback) {
    this.mapEvents[event] = callback;
  }

  public start() {
    this.io = new Server(this.server, { cors: { origin: "*" } });

    this.io.on("connection", (socket) => {
      socket.emit("me", socket.id);

      Object.entries(this.mapEvents).forEach(([event, callback]) => {
        socket.on(event, (...params) => callback(socket, ...params));
      });
    });
  }
}

export default Ws;
