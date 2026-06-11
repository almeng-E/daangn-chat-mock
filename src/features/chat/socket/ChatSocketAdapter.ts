// ─────────────────────────────────────────────────────────────────────────
// Step 5. 테스트 가능한 구조 — Socket Adapter 인터페이스 (설계는 제공)
//
// 왜 WebSocket 을 adapter 로 분리하는가?
//  - 컴포넌트/훅에 `new WebSocket(...)` 을 직접 박으면 테스트가 거의 불가능하다.
//    (jsdom 에는 진짜 서버가 없고, 타이밍/네트워크를 제어할 수 없다.)
//  - 그래서 "연결/수신/전송/구독" 을 추상 인터페이스로 정의하고,
//      · 브라우저에서는 WebSocketChatSocketAdapter (진짜 WebSocket)
//      · 테스트에서는 FakeChatSocketAdapter (이벤트를 손으로 발생)
//    두 구현을 갈아끼운다.
//  - 이렇게 해두면 Step 7 에서 SDK 로 감쌀 때도 구조가 자연스럽다.
//
// 이 파일(인터페이스/이벤트 타입)은 "설계"라서 채워서 제공한다.
// 실제 구현(Wesocket/Fake)과 훅은 직접 학습으로 채운다. (TODO 주석 참고)
// ─────────────────────────────────────────────────────────────────────────

/** 어댑터가 바깥으로 알리는 "날것의" 소켓 이벤트. (SDK 의 의미 있는 ChatEvent 와 구분) */
export type ChatSocketEvent =
  | { type: "open" }
  | { type: "close"; code?: number; reason?: string }
  | { type: "error"; error: unknown }
  | { type: "message"; data: unknown };

export interface ChatSocketAdapter {
  /** 연결을 시작한다. (멱등하게 만들면 좋다 — 이미 연결돼 있으면 무시) */
  connect(): void;
  /** 연결을 끊는다. */
  disconnect(): void;
  /** 서버로 데이터를 보낸다. (보통 JSON.stringify 해서 전송) */
  send(data: unknown): void;
  /** 이벤트 구독. 반환값은 구독 해제 함수. */
  subscribe(listener: (event: ChatSocketEvent) => void): () => void;
}
