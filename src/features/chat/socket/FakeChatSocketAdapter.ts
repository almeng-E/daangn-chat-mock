import type { ChatSocketAdapter, ChatSocketEvent } from "./ChatSocketAdapter";

// ─────────────────────────────────────────────────────────────────────────
// Step 5~6 — 테스트용 가짜 어댑터. (이건 "도구"라서 동작하도록 제공한다)
//
// 왜 테스트에서 진짜 WebSocket 대신 이걸 쓰는가?
//  - 진짜 WebSocket 은 서버·네트워크·타이밍에 의존해서 테스트가 느리고 불안정하다.
//  - Fake 는 connect/send 가 무엇을 했는지 기록하고, open/message/close 이벤트를
//    "테스트가 원하는 시점에" 손으로 발생시킬 수 있다. → 시나리오를 결정론적으로 검증.
//
// 사용 예 (Step 6 테스트):
//   const fake = new FakeChatSocketAdapter();
//   fake.connect();
//   fake.emitOpen();                       // 연결됨
//   fake.emitMessage({ type: "ack", id }); // 서버가 ack 를 보냄
// ─────────────────────────────────────────────────────────────────────────
export class FakeChatSocketAdapter implements ChatSocketAdapter {
  private listeners = new Set<(event: ChatSocketEvent) => void>();

  /** 테스트 단언용 기록 */
  connected = false;
  readonly sent: unknown[] = [];

  connect(): void {
    this.connected = true;
  }

  disconnect(): void {
    this.connected = false;
    this.emit({ type: "close" });
  }

  send(data: unknown): void {
    this.sent.push(data);
  }

  subscribe(listener: (event: ChatSocketEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ── 테스트가 이벤트를 "손으로" 발생시키는 제어 표면 ──────────
  emitOpen(): void {
    this.emit({ type: "open" });
  }

  emitMessage(data: unknown): void {
    this.emit({ type: "message", data });
  }

  emitClose(code?: number, reason?: string): void {
    this.emit({ type: "close", code, reason });
  }

  emitError(error: unknown): void {
    this.emit({ type: "error", error });
  }

  private emit(event: ChatSocketEvent): void {
    this.listeners.forEach((l) => l(event));
  }
}
