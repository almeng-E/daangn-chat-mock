import type { TradeContext } from "../model/types";
import "./ChatContextCard.css";

export function ChatContextCard({ trade }: { trade: TradeContext }) {
  return (
    <section className="context-card" aria-label="거래 정보">
      <div className="context-card__thumb" aria-hidden>
        {trade.thumbnailUrl ? (
          <img src={trade.thumbnailUrl} alt="" />
        ) : (
          <span className="context-card__thumb-placeholder" />
        )}
      </div>

      <div className="context-card__body">
        {trade.status && <span className="context-card__status">{trade.status}</span>}
        <p className="context-card__title">{trade.title}</p>
        <p className="context-card__price">{trade.price}</p>
      </div>

      <button type="button" className="context-card__action" aria-label="거래 진행하기">
        거래 진행
      </button>
    </section>
  );
}
