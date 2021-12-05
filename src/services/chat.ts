import { Socket } from "socket.io";
import { ChatEvents, Message } from "../data/chat";

type OnJoinChannel = {
  channel: string;
  user: string;
};

export async function onJoinChannel(socket: Socket, params: OnJoinChannel) {
  const { channel, user } = params;

  socket.join(channel);
  socket.broadcast.to(channel).emit(ChatEvents.UserJoined, user);
}

export async function onSendMessage(socket: Socket, message: Message) {
  const { channel } = message;
  socket.broadcast.to(channel).emit(ChatEvents.NewMessage, message);
}
