import type { ChatRoom, Message } from "../model/types";

// 앱 코드는 "진짜 HTTP"를 호출한다. 응답을 가로채는 건 MSW(mockHandlers.ts)의 몫이다.
// 그래서 이 파일은 mock 인지 실서버인지 몰라도 된다 = 나중에 교체가 쉽다.

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`요청 실패: ${res.status} ${url}`);
  }
  return (await res.json()) as T;
}

/** 채팅방 정보(상대 프로필, 거래 맥락) 조회. */
export function getChatRoom(roomId: string): Promise<ChatRoom> {
  return getJson<ChatRoom>(`/api/rooms/${roomId}`);
}

/** 채팅방 진입 시 보여줄 초기 메시지 목록 조회. */
export function getInitialMessages(roomId: string): Promise<Message[]> {
  return getJson<Message[]>(`/api/rooms/${roomId}/messages`);
}
