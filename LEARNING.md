# 학습 루트 — WebSocket + Zustand

이 레포는 **네이티브 WebSocket**과 **Zustand 상태관리**를 직접 손으로 익히기 위한 mock 당근 채팅이다.
완성된 메신저가 목표가 아니라, "동작하는 ws 서버 + 정적 UI"가 주어진 상태에서
**클라이언트의 실시간 연결/송수신을 내가 한 단계씩 구현**하는 게 목적이다.

## 무엇이 이미 되어 있나 / 무엇을 내가 하나

| 구분 | 상태 |
| --- | --- |
| ws 서버 (`server/index.ts`) | ✅ 완성 — 연결 시 history push, 메시지 echo/broadcast |
| 정적 채팅 UI (`src/features/chat/components/*`) | ✅ 완성 — fixtures로 렌더 |
| Zustand 스토어 (`src/features/chat/store/chatStore.ts`) | ✅ 완성 — 액션 준비됨 |
| **WebSocket 클라이언트 연결/송수신** | ⬜ 내가 구현 (아래 Step 2~6) |

현재 `ChatRoomPage`는 마운트 시 `mockInitialMessages`로 스토어를 seed 하고,
전송은 낙관적 pending만 스토어에 추가한다(소켓 미사용). 이 자리를 실시간 소켓으로 바꾸는 게 과제다.

## 실행

```bash
npm install
npm run server   # ws://localhost:8787  (먼저 켜 둔다)
npm run dev      # http://localhost:5173
```

두 탭을 열고 서로 메시지를 보내면 대화가 되도록 서버가 broadcast 한다(소켓을 연결한 뒤부터).

## 아키텍처

```
[브라우저]  WebSocket  [ws 서버 :8787]
  UI  ─ read ─▶ Zustand store
  UI  ─ send ─▶ useChatSocket(내가 구현) ─▶ socket.send()
  socket.onmessage ─▶ store 액션 호출 ─▶ UI 갱신
```

- **HTTP는 쓰지 않는다.** 방 정보·초기 메시지도 연결 직후 서버가 소켓으로 push 한다.
- **상태는 전부 Zustand에.** 단, 입력창 텍스트처럼 컴포넌트 안에서만 쓰는 값은 local state로 둔다
  (`MessageComposer` 참고).

## ws 프로토콜 (서버와 약속된 메시지 형태)

서버 → 클라이언트
```jsonc
{ "type": "init",        "room": ChatRoom, "messages": Message[] }   // 연결 직후 1회
{ "type": "message:ack", "tempId": string, "message": Message }      // 내가 보낸 것 확정(status: "sent")
{ "type": "message:new", "message": Message }                        // 다른 클라이언트가 보낸 메시지
```

클라이언트 → 서버
```jsonc
{ "type": "message:send", "tempId": string, "text": string }
```

타입 정의는 `src/features/chat/model/types.ts` 참고. 서버가 `id`/`createdAt`를 부여한다.

---

## 단계별 루트

### Step 1. Zustand 익히기 (코드 읽기)
- `src/features/chat/store/chatStore.ts`의 상태(`messages`, `connectionStatus`)와
  액션(`hydrateMessages`, `addPendingMessage`, `updateMessageStatus`, `addIncomingMessage`,
  `setConnectionStatus`)을 읽는다.
- `ChatRoomPage`가 `useChatStore((s) => s.messages)`로 어떻게 구독하는지 본다.
- 직접 해보기: 전송 시 `addPendingMessage`가 호출되어 UI에 즉시 반영되는 흐름(낙관적 업데이트) 확인.

### Step 2. `useChatSocket` 만들기 (연결)
- `src/features/chat/hooks/useChatSocket.ts`를 새로 만든다.
- `useEffect`에서 `const ws = new WebSocket("ws://localhost:8787")`.
- `ws.onopen` → `setConnectionStatus("connected")`, 마운트 직후엔 `"connecting"`.
- cleanup에서 `ws.close()`.
- `ChatRoomPage`에서 이 훅을 호출하고, 헤더 배지가 `연결됨`으로 바뀌는지 확인.

### Step 3. `init` 수신 → seed 대체
- `ws.onmessage`에서 `JSON.parse`.
- `type === "init"`이면 `hydrateMessages(payload.messages)`.
- `ChatRoomPage`의 `mockInitialMessages` seed를 제거하고 서버 데이터로 대체.

### Step 4. 전송 흐름 (pending → sent)
- 전송 시: `tempId` 생성 → `addPendingMessage`(status `"pending"`) →
  `ws.send(JSON.stringify({ type: "message:send", tempId, text }))`.
- `type === "message:ack"` 수신 시: 임시 메시지를 서버가 준 `message`로 교체하거나
  `updateMessageStatus(id, "sent")`로 확정. (tempId ↔ 실제 id 매핑 방법을 직접 설계)

### Step 5. 상대 메시지 수신
- `type === "message:new"` 수신 시 `addIncomingMessage(payload.message)`.
- 두 번째 탭을 열어 서로 메시지를 주고받아 본다.

### Step 6. 연결 생명주기
- `ws.onclose` / `ws.onerror` → `setConnectionStatus("disconnected")`.
- 도전: 일정 시간 뒤 자동 재연결(backoff) 직접 구현. 서버를 껐다 켜며 확인.

### Step 7. 테스트
- **도구**: `Vitest`(테스트 러너) + `React Testing Library`(컴포넌트 렌더/조회).
  둘은 경쟁 관계가 아니라 **함께** 쓴다 — Vitest가 테스트를 실행하고, RTL이 컴포넌트를
  렌더해 DOM을 조회한다. matcher는 `@testing-library/jest-dom`.
- 권장 순서:
  1. **스토어 단위 테스트** — `chatStore`는 순수 함수라 가장 쉽다.
     `addPendingMessage` → `updateMessageStatus("...", "sent")` 결과를 단언.
  2. **컴포넌트 렌더 테스트(RTL)** — `MessageBubble.smoke.test.tsx`가 출발점.
     text/system/trade-card, 내/상대 구분, pending/failed 표시를 늘려 본다.
  3. **소켓 훅 테스트** — 진짜 서버 대신 가짜 WebSocket을 주입한다.
     `useChatSocket`이 `WebSocket`을 직접 `new` 하면 테스트가 어려우니,
     소켓 생성 부분을 주입 가능하게 빼거나 `mock-socket` 라이브러리를 쓴다.
     (이때 "왜 직접 `new WebSocket` 하면 테스트가 어려운가"를 체감하게 된다.)
- 실행: `npm run test` / `npm run test:watch`.

---

## 구현하지 않은 것 (의도적 제외)
로그인, 실제 API/DB, 이미지 업로드, 푸시/읽음/타이핑, 신고·차단, 다중 채팅방,
무한 스크롤, SDK 추상화, Storybook, E2E.
