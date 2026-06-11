import { useQuery } from "@tanstack/react-query";
import { getChatRoom, getInitialMessages } from "./chatApi";

// ─────────────────────────────────────────────────────────────────────────
// 왜 HTTP 초기 데이터는 TanStack Query 로 다루는가?
//
//  - 채팅방 정보 / 초기 메시지 목록은 전형적인 "서버 상태"다.
//    한 번 가져오면 되고, 캐싱·로딩·에러·재요청 같은 패턴이 매번 똑같다.
//  - 이런 boilerplate(로딩 플래그, 에러 처리, 중복요청 방지)를 직접 짜면
//    실수도 많고 화면마다 반복된다. Query 가 이걸 표준화해 준다.
//  - 반대로 "실시간으로 계속 바뀌는 메시지 목록"은 Query 의 캐시 모델과
//    잘 안 맞는다 → 그건 Zustand(chatStore)가 맡는다.
// ─────────────────────────────────────────────────────────────────────────

export const chatKeys = {
  room: (roomId: string) => ["chat", "room", roomId] as const,
  messages: (roomId: string) => ["chat", "messages", roomId] as const,
};

export function useChatRoomQuery(roomId: string) {
  return useQuery({
    queryKey: chatKeys.room(roomId),
    queryFn: () => getChatRoom(roomId),
  });
}

export function useInitialMessagesQuery(roomId: string) {
  return useQuery({
    queryKey: chatKeys.messages(roomId),
    queryFn: () => getInitialMessages(roomId),
  });
}
