import type { Message, TextMessage, TradeCardMessage } from "../model/types";
import { formatKoreanTime } from "../lib/formatTime";
import "./MessageBubble.css";

interface MessageBubbleProps {
  message: Message;
  /** 이 메시지를 내가 보냈는가? (text 메시지에만 의미 있음) */
  isMine: boolean;
}

// ─────────────────────────────────────────────────────────────────────────
// 메시지 렌더링은 discriminated union 을 switch 로 좁혀서 그린다.
//
// ⚠️ 알 수 없는 type 이 와도 앱이 터지면 안 된다. (types.ts 의 설계 메모 참고)
//   - default 분기에서 throw 하지 않고 fallback UI 를 그린다.
//   - 서버가 새 메시지 타입을 먼저 배포해도 클라이언트가 깨지지 않는다.
// ─────────────────────────────────────────────────────────────────────────
export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  switch (message.type) {
    case "text":
      return <TextBubble message={message} isMine={isMine} />;
    case "system":
      return <div className="msg-system">{message.text}</div>;
    case "trade-card":
      return <TradeCardBubble message={message} />;
    default:
      // 미래의 알 수 없는 메시지 타입을 위한 fallback.
      return <UnknownBubble />;
  }
}

function TextBubble({ message, isMine }: { message: TextMessage; isMine: boolean }) {
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";

  // 시간/상태 메타. 실패 시에는 시간 대신 "전송 실패"를 강조해서 보여준다.
  const meta = (
    <span className="msg-text__meta">
      {isFailed ? (
        <button type="button" className="msg-text__retry">
          전송 실패 · 다시 시도
        </button>
      ) : isPending ? (
        <span className="msg-text__status">전송 중…</span>
      ) : (
        <time dateTime={message.createdAt}>{formatKoreanTime(message.createdAt)}</time>
      )}
    </span>
  );

  return (
    <div className={`msg-row ${isMine ? "msg-row--mine" : "msg-row--other"}`}>
      {isMine && meta}
      <div
        className={[
          "msg-text",
          isMine ? "msg-text--mine" : "msg-text--other",
          isPending ? "msg-text--pending" : "",
          isFailed ? "msg-text--failed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {message.text}
      </div>
      {!isMine && meta}
    </div>
  );
}

function TradeCardBubble({ message }: { message: TradeCardMessage }) {
  return (
    <div className="msg-trade-card">
      <div className="msg-trade-card__thumb" aria-hidden>
        {message.thumbnailUrl ? <img src={message.thumbnailUrl} alt="" /> : null}
      </div>
      <div className="msg-trade-card__body">
        <p className="msg-trade-card__title">{message.title}</p>
        <p className="msg-trade-card__price">{message.price}</p>
      </div>
    </div>
  );
}

function UnknownBubble() {
  return (
    <div className="msg-system msg-system--unknown">
      지원하지 않는 메시지예요. 최신 버전에서 확인해 주세요.
    </div>
  );
}
