import { http, HttpResponse, delay } from "msw";
import { mockChatRoom, mockInitialMessages } from "../model/fixtures";

// ─────────────────────────────────────────────────────────────────────────
// Step 3. HTTP mock (MSW)
//
// 실제 API 서버를 만들지 않는다. 대신 MSW 로 네트워크 레벨에서 가로채서
// "진짜 fetch 가 일어난 것처럼" 응답을 돌려준다.
//  - 앱 코드(chatApi.ts)는 진짜 fetch 를 쓴다 → 나중에 실서버로 바꾸기 쉽다.
//  - 같은 핸들러를 브라우저(dev)와 테스트(Vitest)에서 공유한다.
// ─────────────────────────────────────────────────────────────────────────

export const handlers = [
  // 채팅방 정보 조회
  http.get("/api/rooms/:roomId", async ({ params }) => {
    await delay(400); // 로딩 상태를 눈으로 보기 위한 인위적 지연
    if (params.roomId !== mockChatRoom.id) {
      return HttpResponse.json({ message: "room not found" }, { status: 404 });
    }
    return HttpResponse.json(mockChatRoom);
  }),

  // 초기 메시지 목록 조회
  http.get("/api/rooms/:roomId/messages", async () => {
    await delay(600);
    return HttpResponse.json(mockInitialMessages);
  }),
];
