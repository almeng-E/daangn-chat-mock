import type { ChatClient, ChatClientOptions, ChatEvent } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// Step 7 (학습용 스텁) — createChatClient()
//
// SDK 가 앱 코드에서 숨겨주는 복잡성:
//  - WebSocket url 조립, 토큰 인증, 재연결, JSON 직렬화/역직렬화
//  - 날것의 소켓 이벤트(open/message/close) → 의미 있는 도메인 이벤트로 번역
//    (예: 들어온 message 가 내 echo 면 message.sent, 남의 것이면 message.received)
//  - pending/sent/failed 상태 전이 규칙
//  => 앱은 chatClient.subscribe(...) 와 sendMessage(...) 만 알면 된다.
//
// 🎯 직접 채워볼 부분:
//  - 내부에서 WebSocketChatSocketAdapter 를 생성/보관
//  - adapter 이벤트를 ChatEvent 로 번역해서 listeners 에 broadcast
//  - subscribe/unsubscribe (아래 listener 집합 관리 패턴 재사용)
// ─────────────────────────────────────────────────────────────────────────

export function createChatClient(options: ChatClientOptions): ChatClient {
  const listeners = new Set<(event: ChatEvent) => void>();
  // TODO(Step 7): const url = options.url ?? `wss://.../chat?token=${options.accessToken}`;
  //               const adapter = new WebSocketChatSocketAdapter(url);
  void options;

  const broadcast = (event: ChatEvent) => listeners.forEach((l) => l(event));
  void broadcast; // TODO: 어댑터 이벤트를 번역해 broadcast 호출

  return {
    connect() {
      // TODO(Step 7): adapter.connect()
    },
    disconnect() {
      // TODO(Step 7): adapter.disconnect()
    },
    sendMessage(roomId, text) {
      // TODO(Step 7): pending 생성 → adapter.send(...) → message.sent/failed 로 번역
      void roomId;
      void text;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
