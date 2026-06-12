import { useEffect, useRef } from "react";
import type { Message } from "../model/types";
import { MessageBubble } from "./MessageBubble";
import "./MessageList.css";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="msg-list msg-list--empty">
        <p className="msg-list__empty-text">
          아직 메시지가 없어요.
          <br />
          첫 메시지를 보내 보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="msg-list" role="log" aria-label="메시지 목록">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isMine={message.type === "text" && message.senderId === currentUserId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
