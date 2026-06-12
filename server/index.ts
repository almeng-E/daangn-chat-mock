import { randomUUID } from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";
import {
  CURRENT_USER_ID,
  mockChatRoom,
  mockInitialMessages,
} from "../src/features/chat/model/fixtures";
import type { Message, TextMessage } from "../src/features/chat/model/types";

const PORT = 8787;
const OPPONENT_ID = mockChatRoom.opponent.id;

const wss = new WebSocketServer({ port: PORT });

function send(socket: WebSocket, payload: unknown) {
  socket.send(JSON.stringify(payload));
}

function broadcastOthers(sender: WebSocket, payload: unknown) {
  for (const client of wss.clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      send(client, payload);
    }
  }
}

wss.on("connection", (socket) => {
  console.log("[ws] client connected. total =", wss.clients.size);

  send(socket, {
    type: "init",
    room: mockChatRoom,
    messages: mockInitialMessages,
  });

  socket.on("message", (raw) => {
    let parsed: { type?: string; tempId?: string; text?: string };
    try {
      parsed = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (parsed.type !== "message:send" || !parsed.text) return;

    const createdAt = new Date().toISOString();
    const id = randomUUID();

    const ackMessage: TextMessage = {
      id,
      roomId: mockChatRoom.id,
      type: "text",
      senderId: CURRENT_USER_ID,
      text: parsed.text,
      createdAt,
      status: "sent",
    };
    send(socket, { type: "message:ack", tempId: parsed.tempId, message: ackMessage });

    const broadcastMessage: Message = {
      id,
      roomId: mockChatRoom.id,
      type: "text",
      senderId: OPPONENT_ID,
      text: parsed.text,
      createdAt,
    };
    broadcastOthers(socket, { type: "message:new", message: broadcastMessage });
  });

  socket.on("close", () => {
    console.log("[ws] client disconnected. total =", wss.clients.size);
  });
});

console.log(`[ws] chat server listening on ws://localhost:${PORT}`);
