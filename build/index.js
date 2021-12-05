"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = process.env.PORT;
        app.use((0, morgan_1.default)("dev"));
        app.use((0, cors_1.default)());
        const server = http_1.default.createServer(app);
        const io = new socket_io_1.Server(server, {
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
    });
}
main().catch(console.error);
