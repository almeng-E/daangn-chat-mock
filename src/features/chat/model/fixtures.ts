// Step 1 의 정적 UI + Step 3 의 mock API 가 함께 쓰는 fixture 데이터.
// WebSocket 없이도 화면을 완성할 수 있도록, "이미 와 있는 것처럼" 보이는 더미 데이터를 둔다.
import type { ChatRoom, Message } from "./types";

/** 현재 로그인한 "나"의 id. 내 메시지 / 상대 메시지를 가르는 기준이 된다. */
export const CURRENT_USER_ID = "me";

export const MOCK_ROOM_ID = "room-1";

export const mockChatRoom: ChatRoom = {
  id: MOCK_ROOM_ID,
  opponent: {
    id: "user-sinbad",
    nickname: "신밧드",
    mannerTemp: 36.5,
    responseInfo: "보통 1시간 이내 응답",
  },
  trade: {
    title: "아이폰 13 거래 문의",
    price: "750,000원",
    status: "판매중",
  },
};

// 이미지의 대화 흐름을 그대로 재현한 초기 메시지들.
// system 메시지로 날짜 구분선을, trade-card 로 거래 맥락을 흐름 안에 넣어 본다.
export const mockInitialMessages: Message[] = [
  {
    id: "m-trade-card",
    roomId: MOCK_ROOM_ID,
    type: "trade-card",
    title: "아이폰 13 128GB 미드나이트",
    price: "750,000원",
    createdAt: "2021-04-01T15:41:00+09:00",
  },
  {
    id: "m1",
    roomId: MOCK_ROOM_ID,
    type: "text",
    senderId: CURRENT_USER_ID,
    text: "안녕하세요",
    createdAt: "2021-04-01T15:42:00+09:00",
  },
  {
    id: "m2",
    roomId: MOCK_ROOM_ID,
    type: "text",
    senderId: CURRENT_USER_ID,
    text: "혹시 유모차 팔렸나요?",
    createdAt: "2021-04-01T15:42:10+09:00",
  },
  {
    id: "m3",
    roomId: MOCK_ROOM_ID,
    type: "text",
    senderId: "user-sinbad",
    text: "아니요 아직 안팔렸어요",
    createdAt: "2021-04-01T15:44:00+09:00",
  },
  {
    id: "m-date",
    roomId: MOCK_ROOM_ID,
    type: "system",
    text: "2021년 4월 2일",
    createdAt: "2021-04-02T00:00:00+09:00",
  },
  {
    id: "m4",
    roomId: MOCK_ROOM_ID,
    type: "text",
    senderId: CURRENT_USER_ID,
    text: "직거래 하고 싶은데요",
    createdAt: "2021-04-02T15:44:00+09:00",
  },
  {
    id: "m5",
    roomId: MOCK_ROOM_ID,
    type: "text",
    senderId: "user-sinbad",
    text: "혹시 어디서 거래하고 싶으세요?",
    createdAt: "2021-04-02T15:44:30+09:00",
  },
  {
    id: "m6",
    roomId: MOCK_ROOM_ID,
    type: "text",
    senderId: "user-sinbad",
    text: "내일 역삼역 앞으로 7시까지 와주실 수 있나요?\n퇴근하고 나가서 드리면 좋을 것 같아요~^^",
    createdAt: "2021-04-02T15:45:00+09:00",
  },
  {
    id: "m7",
    roomId: MOCK_ROOM_ID,
    type: "text",
    senderId: CURRENT_USER_ID,
    text: "네~ 그럼 7시까지 그리로 갈게요~",
    createdAt: "2021-04-02T15:45:30+09:00",
  },
];
