import type { ConnectionStatus } from "../model/types";
import "./ConnectionStatusBadge.css";

// WebSocket 연결 상태를 헤더에 작게 표시한다.
// Step 4 에서 useChatSocket 이 이 값을 실제로 바꾼다. 지금은 fixture/스토어 기본값.
const LABEL: Record<ConnectionStatus, string> = {
  connecting: "연결 중",
  connected: "연결됨",
  disconnected: "연결 끊김",
};

export function ConnectionStatusBadge({ status }: { status: ConnectionStatus }) {
  return (
    <span className={`conn-badge conn-badge--${status}`} role="status" aria-live="polite">
      <span className="conn-badge__dot" aria-hidden />
      {LABEL[status]}
    </span>
  );
}
