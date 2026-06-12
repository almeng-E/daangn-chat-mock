export type MessageStatus = "pending" | "sent" | "failed";

export interface BaseMessage {
  id: string;
  roomId: string;
  createdAt: string;
}

export interface TextMessage extends BaseMessage {
  type: "text";
  senderId: string;
  text: string;
  status?: MessageStatus;
}

export interface SystemMessage extends BaseMessage {
  type: "system";
  text: string;
}

export interface TradeCardMessage extends BaseMessage {
  type: "trade-card";
  title: string;
  price: string;
  thumbnailUrl?: string;
}

export type Message = TextMessage | SystemMessage | TradeCardMessage;

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export interface ChatOpponent {
  id: string;
  nickname: string;
  profileImageUrl?: string;
  mannerTemp: number;
  responseInfo?: string;
}

export interface TradeContext {
  title: string;
  price: string;
  thumbnailUrl?: string;
  status?: string;
}

export interface ChatRoom {
  id: string;
  opponent: ChatOpponent;
  trade: TradeContext;
}
