export enum ChatEvents {
  JoinChannel = "@join-channel",
  UserJoined = "@user-joined",
  SendMessage = "@send-message",
  NewMessage = "@new-message",
}

export interface Message {
  user: string;
  channel: string;
  message: string;
  date: Date;
}
