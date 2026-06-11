import type { ChatSocketAdapter, ChatSocketEvent } from "./ChatSocketAdapter";

// ─────────────────────────────────────────────────────────────────────────
// Step 5 (학습용 스텁) — 진짜 WebSocket 을 쓰는 어댑터.
//
// 🎯 직접 채워볼 부분: 아래 TODO 들.
//   생성자에서 url 만 보관하고, connect() 에서 new WebSocket(url) 을 만든다.
//   ws 의 onopen/onmessage/onclose/onerror 를 emit(...) 으로 listeners 에 흘려보낸다.
//
// 구독 관리(아래 subscribe/emit)는 Fake 와 똑같으니 미리 채워 둔다.
// → "리스너 집합 관리" 패턴을 한 번 익혀 두면 SDK(Step 7)에서 그대로 재사용한다.
// ─────────────────────────────────────────────────────────────────────────
export class WebSocketChatSocketAdapter implements ChatSocketAdapter {
  private ws: WebSocket | null = null;
  private listeners = new Set<(event: ChatSocketEvent) => void>();

  constructor(private readonly url: string) {}

  connect(): void {
    // TODO(Step 4~5):
    //   if (this.ws) return; // 멱등성
    //   this.ws = new WebSocket(this.url);
    //   this.ws.onopen = () => this.emit({ type: "open" });
    //   this.ws.onmessage = (e) => this.emit({ type: "message", data: e.data });
    //   this.ws.onclose = (e) => this.emit({ type: "close", code: e.code, reason: e.reason });
    //   this.ws.onerror = (e) => this.emit({ type: "error", error: e });
    // (아래 void 들은 "아직 안 쓴 멤버" 컴파일 경고만 막아 둔 것 — 구현하면 지운다)
    void this.url;
    void this.ws;
    void this.emit;
    throw new Error("TODO: WebSocketChatSocketAdapter.connect 미구현 (Step 4~5 학습)");
  }

  disconnect(): void {
    // TODO(Step 4~5): this.ws?.close(); this.ws = null;
    throw new Error("TODO: WebSocketChatSocketAdapter.disconnect 미구현");
  }

  send(data: unknown): void {
    // TODO(Step 4~5): this.ws?.send(typeof data === "string" ? data : JSON.stringify(data));
    void data;
    throw new Error("TODO: WebSocketChatSocketAdapter.send 미구현");
  }

  // 구독 관리는 공통 패턴이라 미리 제공한다.
  subscribe(listener: (event: ChatSocketEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: ChatSocketEvent): void {
    this.listeners.forEach((l) => l(event));
  }
}
