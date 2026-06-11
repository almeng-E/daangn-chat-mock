// ─────────────────────────────────────────────────────────────────────────
// Step 2. 메시지 타입 설계 (Discriminated Union)
//
// 메시지는 `type` 필드를 판별자(discriminant)로 갖는 union 으로 설계한다.
// switch (message.type) 로 좁히면 각 분기에서 해당 타입의 필드만 안전하게 쓸 수 있다.
//
// ⚠️ 설계 메모 (SDK 로 확장할 때를 대비)
//  - 메시지 타입은 앞으로 계속 늘어난다. (이미지/이모지/약속카드/송금 등)
//  - SDK 에서는 메시지 타입을 "안정적으로" 확장할 수 있어야 한다.
//    => 렌더러는 알 수 없는 type 이 와도 throw 하지 않고 fallback UI 를 보여줘야 한다.
//  - 서버가 새 type 을 먼저 배포하고 클라이언트가 나중에 따라가는 상황이 흔하다.
//    => 그래서 "모르는 메시지는 무시하지 말고, 최소한 깨지지 않게" 그리는 게 중요하다.
//    (MessageBubble 의 default 분기 + UnknownMessage 참고)
// ─────────────────────────────────────────────────────────────────────────

/** 내가 보낸 메시지의 전송 생명주기. WebSocket echo/ack 를 받으면 sent 로 바뀐다. */
export type MessageStatus = "pending" | "sent" | "failed";

export interface BaseMessage {
  id: string;
  roomId: string;
  /** ISO 8601 문자열. 렌더링 시점에 로컬 시간으로 포맷한다. */
  createdAt: string;
}

export interface TextMessage extends BaseMessage {
  type: "text";
  senderId: string;
  text: string;
  /** 서버에서 확정된 메시지는 status 가 없을 수 있다. 내가 보낸 낙관적 메시지에만 붙는다. */
  status?: MessageStatus;
}

/** "OO님이 입장했어요", 날짜 구분선 등. 발신자가 없다. */
export interface SystemMessage extends BaseMessage {
  type: "system";
  text: string;
}

/** 거래/서비스 맥락을 메시지 흐름 안에 카드로 보여주는 타입. */
export interface TradeCardMessage extends BaseMessage {
  type: "trade-card";
  title: string;
  price: string;
  thumbnailUrl?: string;
}

export type Message = TextMessage | SystemMessage | TradeCardMessage;

/** 위 union 에 포함되지 않은 미래의 메시지 타입을 표현하기 위한 보조 타입. */
export type UnknownMessage = BaseMessage & { type: string; [key: string]: unknown };

// ─────────────────────────────────────────────────────────────────────────
// 채팅방 / 연결 상태 (HTTP 로 가져오는 서버 상태)
// ─────────────────────────────────────────────────────────────────────────

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export interface ChatOpponent {
  id: string;
  nickname: string;
  profileImageUrl?: string;
  /** 매너온도. SEED 의 MannerTemp 컴포넌트로 표시한다. */
  mannerTemp: number;
  /** "보통 1시간 이내 응답" 같은 보조 설명. */
  responseInfo?: string;
}

export interface TradeContext {
  title: string;
  price: string;
  thumbnailUrl?: string;
  /** "판매중" | "예약중" | "거래완료" 등. 자유 문자열로 둬서 확장 가능하게. */
  status?: string;
}

export interface ChatRoom {
  id: string;
  opponent: ChatOpponent;
  trade: TradeContext;
}
