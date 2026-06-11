// ─────────────────────────────────────────────────────────────────────────
// Step 7 (학습용 스텁) — 작은 Chat SDK 의 공개 타입.
//
// SDK 의 타입은 "앱이 보게 될 표면"이다. 여기서는 의미 있는 도메인 이벤트
// (message.received / sent / failed, connection.*) 로 표현한다.
// 이 타입들은 설계라서 채워서 제공한다. createChatClient 의 구현이 학습 대상.
// ─────────────────────────────────────────────────────────────────────────

export interface SdkMessage {
  id: string;
  roomId: string;
  senderId: string;
  text: string;
  createdAt: string;
  status?: "pending" | "sent" | "failed";
}

export type ChatEvent =
  | { type: "message.received"; message: SdkMessage }
  | { type: "message.sent"; message: SdkMessage }
  | { type: "message.failed"; tempId: string; reason?: string }
  | { type: "connection.connected" }
  | { type: "connection.disconnected" }
  | { type: "connection.error"; error: unknown };

export interface ChatClientOptions {
  userId: string;
  accessToken: string;
  url?: string;
}

export interface ChatClient {
  connect(): void;
  disconnect(): void;
  sendMessage(roomId: string, text: string): void;
  subscribe(listener: (event: ChatEvent) => void): () => void;
}
