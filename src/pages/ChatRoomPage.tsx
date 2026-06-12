import { useEffect } from "react";
import { useChatStore } from "../features/chat/store/chatStore";
import { CURRENT_USER_ID, mockChatRoom, mockInitialMessages } from "../features/chat/model/fixtures";
import type { Message } from "../features/chat/model/types";
import { ChatHeader } from "../features/chat/components/ChatHeader";
import { ChatContextCard } from "../features/chat/components/ChatContextCard";
import { MessageList } from "../features/chat/components/MessageList";
import { MessageComposer } from "../features/chat/components/MessageComposer";

export function ChatRoomPage({ roomId }: { roomId: string }) {
  const connectionStatus = useChatStore((s) => s.connectionStatus);
  const messages = useChatStore((s) => s.messages);
  const hydrateMessages = useChatStore((s) => s.hydrateMessages);
  const addPendingMessage = useChatStore((s) => s.addPendingMessage);

  useEffect(() => {
    hydrateMessages(mockInitialMessages);
  }, [hydrateMessages]);

  const handleSend = (text: string) => {
    const pending: Message = {
      id: `tmp-${Date.now()}`,
      roomId,
      type: "text",
      senderId: CURRENT_USER_ID,
      text,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    addPendingMessage(pending);
  };

  return (
    <div className="app-frame">
      <ChatHeader opponent={mockChatRoom.opponent} connectionStatus={connectionStatus} />
      <ChatContextCard trade={mockChatRoom.trade} />
      <MessageList messages={messages} currentUserId={CURRENT_USER_ID} />
      <MessageComposer onSend={handleSend} />
    </div>
  );
}
