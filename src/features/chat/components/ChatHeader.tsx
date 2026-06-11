import { Avatar, MannerTemp, type MannerTempProps } from "@seed-design/react";
import type { ChatOpponent, ConnectionStatus } from "../model/types";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";
import "./ChatHeader.css";

type MannerTempLevel = NonNullable<MannerTempProps["level"]>;

interface ChatHeaderProps {
  opponent: ChatOpponent;
  connectionStatus: ConnectionStatus;
  onBack?: () => void;
}

// 매너온도(0~99) → SEED MannerTemp 의 level(l1~l10) 로 변환.
function tempToLevel(temp: number): MannerTempLevel {
  const level = Math.min(10, Math.max(1, Math.floor(temp / 10) + 1));
  return `l${level}` as MannerTempLevel;
}

// 상단 헤더: 뒤로가기 / 상대 프로필 / 매너온도 / 연결 상태 / 더보기
export function ChatHeader({ opponent, connectionStatus, onBack }: ChatHeaderProps) {
  return (
    <header className="chat-header">
      <button type="button" className="chat-header__icon-btn" aria-label="뒤로가기" onClick={onBack}>
        <BackIcon />
      </button>

      <Avatar.Root size="36" className="chat-header__avatar">
        <Avatar.Image src={opponent.profileImageUrl} alt="" />
        <Avatar.Fallback>{opponent.nickname.slice(0, 1)}</Avatar.Fallback>
      </Avatar.Root>

      <div className="chat-header__info">
        <div className="chat-header__title-row">
          <span className="chat-header__name">{opponent.nickname}</span>
          <MannerTemp level={tempToLevel(opponent.mannerTemp)} className="chat-header__temp">
            {opponent.mannerTemp.toFixed(1)}°C
          </MannerTemp>
        </div>
        <div className="chat-header__subtitle-row">
          {opponent.responseInfo && (
            <span className="chat-header__response">{opponent.responseInfo}</span>
          )}
          <ConnectionStatusBadge status={connectionStatus} />
        </div>
      </div>

      <button type="button" className="chat-header__icon-btn" aria-label="더보기">
        <MoreIcon />
      </button>
    </header>
  );
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}
