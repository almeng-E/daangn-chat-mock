import type { Message, TextMessage, TradeCardMessage } from "../model/types";
import { formatKoreanTime } from "../lib/formatTime";
import "./MessageBubble.css";

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  switch (message.type) {
    case "text":
      return <TextBubble message={message} isMine={isMine} />;
    case "system":
      return <div className="msg-system">{message.text}</div>;
    case "trade-card":
      return <TradeCardBubble message={message} />;
    default:
      return <UnknownBubble />;
  }
}

function TextBubble({ message, isMine }: { message: TextMessage; isMine: boolean }) {
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";

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
