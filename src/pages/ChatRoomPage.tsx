import { useEffect } from "react";
import { useChatRoomQuery, useInitialMessagesQuery } from "../features/chat/api/queries";
import { useChatStore } from "../features/chat/store/chatStore";
import { CURRENT_USER_ID } from "../features/chat/model/fixtures";
import type { Message } from "../features/chat/model/types";
import { ChatHeader } from "../features/chat/components/ChatHeader";
import { ChatContextCard } from "../features/chat/components/ChatContextCard";
import { MessageList } from "../features/chat/components/MessageList";
import { MessageComposer } from "../features/chat/components/MessageComposer";
import "./ChatRoomPage.css";

// ─────────────────────────────────────────────────────────────────────────
// ChatRoomPage: 단일 채팅방 화면의 오케스트레이터.
//  - HTTP 초기 데이터(방 정보 / 메시지)는 TanStack Query 로 가져온다. (Step 3)
//  - 가져온 메시지는 Zustand 스토어로 하이드레이션해서, 이후 실시간 변화를
//    한곳(store)에서 관리할 수 있게 한다. (Step 4 의 소켓이 이 store 를 갱신)
//  - loading / error / success / empty 네 상태를 모두 화면에 표현한다.
// ─────────────────────────────────────────────────────────────────────────
export function ChatRoomPage({ roomId }: { roomId: string }) {
  const roomQuery = useChatRoomQuery(roomId);
  const messagesQuery = useInitialMessagesQuery(roomId);

  const connectionStatus = useChatStore((s) => s.connectionStatus);
  const messages = useChatStore((s) => s.messages);
  const hydrateMessages = useChatStore((s) => s.hydrateMessages);
  const addPendingMessage = useChatStore((s) => s.addPendingMessage);
  const setConnectionStatus = useChatStore((s) => s.setConnectionStatus);

  // HTTP 로 받은 초기 메시지를 store 로 옮긴다. (한 번)
  useEffect(() => {
    if (messagesQuery.data) {
      hydrateMessages(messagesQuery.data);
    }
  }, [messagesQuery.data, hydrateMessages]);

  // ⚠️ 임시(placeholder): Step 4 에서 useChatSocket 이 실제 연결 상태를 바꾼다.
  //   지금은 WebSocket 이 없으므로, 정적 데모가 "연결됨"으로 보이도록 흉내만 낸다.
  useEffect(() => {
    setConnectionStatus("connecting");
    const t = setTimeout(() => setConnectionStatus("connected"), 800);
    return () => clearTimeout(t);
  }, [setConnectionStatus]);

  // 메시지 전송 (Step 1~3 임시 구현)
  //   지금은 낙관적으로 pending 메시지만 store 에 추가한다.
  //   Step 4 에서 이 콜백이 socket.send() 로 바뀌고, echo 수신 시 sent 로 변한다.
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

  // ── loading ────────────────────────────────────────────
  if (roomQuery.isLoading || messagesQuery.isLoading) {
    return (
      <div className="app-frame chat-state">
        <div className="chat-state__spinner" aria-hidden />
        <p className="chat-state__text">채팅방을 불러오는 중…</p>
      </div>
    );
  }

  // ── error ──────────────────────────────────────────────
  // (!roomQuery.data 는 아래 success 분기에서 room 을 non-null 로 좁히기 위한 가드)
  if (roomQuery.isError || messagesQuery.isError || !roomQuery.data) {
    return (
      <div className="app-frame chat-state">
        <p className="chat-state__text">채팅방을 불러오지 못했어요.</p>
        <button
          type="button"
          className="chat-state__retry"
          onClick={() => {
            roomQuery.refetch();
            messagesQuery.refetch();
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // ── success (empty 상태는 MessageList 내부에서 처리) ────
  const room = roomQuery.data;
  return (
    <div className="app-frame">
      <ChatHeader opponent={room.opponent} connectionStatus={connectionStatus} />
      <ChatContextCard trade={room.trade} />
      <MessageList messages={messages} currentUserId={CURRENT_USER_ID} />
      <MessageComposer onSend={handleSend} />
    </div>
  );
}
