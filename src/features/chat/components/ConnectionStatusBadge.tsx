import type { ConnectionStatus } from "../model/types";
import "./ConnectionStatusBadge.css";

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
