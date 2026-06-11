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

  // 메시지가 추가되면 맨 아래로 스크롤. (length 기준이라 status 변경에는 안 움직인다)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  // 빈 상태: 메시지가 하나도 없을 때.
  if (messages.length === 0) {
    return (
      <div className="msg-list msg-list--empty">
        <p className="msg-list__empty-text">아직 메시지가 없어요.
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
