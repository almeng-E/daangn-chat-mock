import { useEffect } from "react";
import type { ChatSocketAdapter } from "../socket/ChatSocketAdapter";
import type { Message } from "../model/types";

// ─────────────────────────────────────────────────────────────────────────
// Step 4 (학습용 스텁) — WebSocket 생명주기를 직접 다루는 훅.
//
// 왜 처음부터 SDK 로 만들지 않고 WebSocket 을 먼저 직접 다루는가?
//  - SDK 는 "복잡함을 숨기는" 추상화다. 숨길 복잡함을 먼저 손으로 겪어보지 않으면
//    무엇을 숨겨야 하는지, 어떤 API 가 편한지 알 수 없다.
//  - 그래서 Step 4 에서는 onopen/onmessage/onclose 의 생명주기와
//    pending→sent 상태 전이를 "날것으로" 경험한 뒤, Step 7 에서 SDK 로 감싼다.
//
// 🎯 직접 채워볼 부분:
//  1. mount 시 adapter.connect(), unmount 시 adapter.disconnect()
//  2. adapter.subscribe 로 이벤트 수신:
//       - "open"   → onConnected(), store.setConnectionStatus("connected")
//       - "close"  → onDisconnected(), store.setConnectionStatus("disconnected")
//       - "message"→ JSON.parse 후 onMessage(message)
//  3. sendMessage(text): 낙관적 pending 추가 → adapter.send(...) → ack 수신 시 sent
// ─────────────────────────────────────────────────────────────────────────

export interface UseChatSocketOptions {
  roomId: string;
  userId: string;
  /** 어댑터 주입 — 브라우저면 WebSocket..., 테스트면 Fake... (DI 로 테스트 가능하게) */
  adapter: ChatSocketAdapter;
  onMessage?: (message: Message) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export interface UseChatSocketReturn {
  sendMessage: (text: string) => void;
}

export function useChatSocket(options: UseChatSocketOptions): UseChatSocketReturn {
  const { adapter } = options;

  useEffect(() => {
    // TODO(Step 4): adapter.connect();
    // const unsubscribe = adapter.subscribe((event) => { ...분기... });
    // return () => { unsubscribe(); adapter.disconnect(); };
    return () => {
      void adapter;
    };
  }, [adapter]);

  const sendMessage = (text: string) => {
    // TODO(Step 4): pending 추가 → adapter.send({ type: "text", roomId, text, ... })
    void text;
  };

  return { sendMessage };
}
