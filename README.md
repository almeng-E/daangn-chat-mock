# 당근 채팅 mock (학습용)

당근마켓 채팅을 흉내 낸 **학습용 mock 프로젝트**입니다.
완성된 메신저를 만드는 게 목적이 아니라, 아래 세 가지를 작게 직접 경험하는 게 목적입니다.

## 1. 프로젝트 목적

- 모바일 웹뷰를 상정한 **단일 채팅방 화면**을 만든다.
- WebSocket의 연결 → 수신 → 전송 → 종료 흐름을 직접 다뤄 본다.
- 테스트 가능한 구조로 코드를 분리한다.
- 마지막에 WebSocket 구현을 `createChatClient()` 형태의 작은 **Chat SDK**로 감싼다.

## 2. 학습 목표

1. **WebSocket** — 연결 생명주기(onopen/onmessage/onclose/onerror), 낙관적 전송(pending → sent/failed)
2. **테스트** — Vitest + React Testing Library + MSW(HTTP) + Fake adapter(WebSocket)
3. **SDK 구조화** — 이벤트 기반 API, subscribe/unsubscribe, 타입 안전한 사용 경험

## 3. 사용 기술 스택

| 분류 | 기술 |
| --- | --- |
| 빌드 | Vite |
| UI | React + TypeScript |
| 디자인 | SEED Design (`@seed-design/react`, `@seed-design/css`) |
| 서버 상태 | TanStack Query |
| 클라이언트 상태 | Zustand |
| HTTP mock | MSW |
| 테스트 | Vitest, React Testing Library |
| WebSocket 테스트 | Fake socket adapter |

## 4. 실행 방법

```bash
npm install
npm run dev      # http://localhost:5173
```

> 이 앱은 전부 mock입니다. `main.tsx`에서 MSW 워커를 켠 뒤 앱을 렌더합니다.
> 데스크톱에서도 모바일 폭(480px)으로 가운데 정렬되어 보입니다.

## 5. 테스트 실행 방법

```bash
npm run test         # 1회 실행
npm run test:watch   # watch 모드
npm run typecheck    # 타입 검사
```

## 6. WebSocket 흐름 설명

> ⚠️ 현재 Step 1~3까지 구현되어 있고, WebSocket(Step 4~)은 **학습용 스텁**입니다.
> 아래는 채워 넣을 때의 목표 흐름입니다.

1. 채팅방 진입 → `connect()` → 상태 `connecting`
2. `onopen` → 상태 `connected` (헤더 배지 초록)
3. `onclose`/`onerror` → 상태 `disconnected` (헤더 배지 빨강)
4. 내가 메시지 전송 → 먼저 `pending`으로 화면에 추가(낙관적 업데이트)
5. 서버 echo/ack 수신 → 해당 메시지를 `sent`로 변경
6. 상대 메시지 push 수신 → 메시지 리스트에 추가

상태 전이: `pending → sent`(성공) / `pending → failed`(실패).

## 7. HTTP와 WebSocket의 역할 분리

| | HTTP (TanStack Query) | WebSocket (Zustand) |
| --- | --- | --- |
| 무엇 | 채팅방 정보, **초기** 메시지 목록 | 실시간 송수신 메시지 |
| 성격 | 요청-응답, 한 번 가져오면 끝(캐시) | 서버가 임의 시점에 push, 상태가 그 자리에서 바뀜 |
| 흐름 | pull (내가 요청) | push (서버가 보냄) |

초기 데이터는 HTTP로 받아 **store에 하이드레이션**하고, 그 이후의 실시간 변화는 store에서 관리합니다.

## 8. TanStack Query와 Zustand를 나눈 이유

- **TanStack Query = 서버 상태(read 캐시).** 로딩/에러/재요청/중복요청 방지 같은
  반복 boilerplate를 표준화해 준다. 초기 채팅방·메시지 로딩에 적합.
- **Zustand = 실시간 클라이언트 상태.** 메시지는 서버가 임의 시점에 push하고,
  내가 보낸 메시지는 pending→sent/failed로 그 자리에서 바뀐다. 요청-응답 캐시 모델보다
  "이벤트로 갱신되는 in-memory 상태"에 가깝다 → Zustand가 맞다.
- 단, 입력창 값처럼 **컴포넌트 안에서만 쓰는 값은 전역 store에 넣지 않고** local state로 둔다.

## 9. SDK 사용 예시 (목표 API)

```ts
const chatClient = createChatClient({
  userId: "user-1",
  accessToken: "mock-token",
});

chatClient.connect();

const unsubscribe = chatClient.subscribe((event) => {
  if (event.type === "message.received") {
    console.log(event.message);
  }
});

chatClient.sendMessage("room-1", "안녕하세요!");
```

**SDK가 앱에서 숨겨주는 복잡성**: WebSocket URL 조립/인증, 재연결, JSON 직렬화,
날것의 소켓 이벤트(open/message/close)를 의미 있는 도메인 이벤트(`message.received` 등)로 번역,
pending/sent/failed 상태 규칙. 앱은 `subscribe` / `sendMessage`만 알면 된다.

## 10. 작성한 테스트 목록

- `MessageBubble.smoke.test.tsx` — 툴체인(Vitest+RTL+jsdom) 동작 확인용 스모크 테스트

> 본격적인 Step 6 테스트(메시지 종류별 렌더링 / 전송 흐름)는 **직접 작성할 학습 과제**입니다.

## 폴더 구조

```txt
src/
  app/            App.tsx, providers.tsx
  pages/          ChatRoomPage.tsx            # loading/error/empty/success 오케스트레이션
  features/chat/
    api/          chatApi.ts, queries.ts, mockHandlers.ts, browser.ts   # Step 3 (HTTP + MSW)
    components/   ChatHeader, ChatContextCard, MessageList, MessageBubble,
                  MessageComposer, ConnectionStatusBadge                # Step 1 (정적 UI)
    hooks/        useChatSocket.ts            # Step 4 (스텁)
    model/        types.ts, fixtures.ts       # Step 2 (메시지 타입)
    socket/       ChatSocketAdapter.ts, WebSocketChatSocketAdapter.ts,
                  FakeChatSocketAdapter.ts    # Step 5 (어댑터)
    store/        chatStore.ts                # Zustand
    lib/          formatTime.ts
  sdk/            chat-sdk.ts, types.ts       # Step 7 (스텁)
  test/           setup.ts, mswServer.ts
```

> 구조 변경점: 원안의 `model/`은 그대로 두되, TanStack Query 훅을 `api/queries.ts`로,
> 시간 포맷 유틸을 `lib/`로 분리했습니다. (관심사별로 파일을 나눠 테스트·재사용이 쉽도록)

## 11. 다음 단계 TODO

현재 **Step 1~3**까지 동작합니다. 아래는 직접 이어서 학습할 과제입니다.

### 학습 과제 (Step 4~7)

1. **Step 4 — `useChatSocket`**: `FakeChatSocketAdapter`를 주입받아 connect/subscribe/disconnect와
   pending→sent 전이를 직접 구현. mock WebSocket echo 서버 붙여 보기.
2. **Step 5 — 어댑터 완성**: `WebSocketChatSocketAdapter`의 connect/send/disconnect 구현.
3. **Step 6 — 테스트 작성**:
   - 메시지 렌더링 테스트(text/system/trade-card, 내/상대 구분, pending/failed 표시)
   - 전송 흐름 테스트(입력 → 전송 → pending → fake 성공 이벤트 → sent)
4. **Step 7 — SDK**: `createChatClient` 구현, 소켓 이벤트 → `ChatEvent` 번역.
5. **`ChatRoomPage` 연결**: 임시 `handleSend`(낙관적 pending만 추가)와 가짜 연결 상태 흉내를
   실제 소켓/SDK로 교체.

### 이번 단계에서 구현하지 않은 것 (의도적으로 제외)

로그인/회원가입, 실제 API/DB, 이미지 업로드, 푸시 알림, 읽음 처리, 타이핑 인디케이터,
신고/차단, 다중 채팅방 목록, 무한 스크롤, 운영 어드민, 패키지 배포, Storybook, Playwright E2E.
