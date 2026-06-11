import { create } from "zustand";
import type { ConnectionStatus, Message, MessageStatus } from "../model/types";

// ─────────────────────────────────────────────────────────────────────────
// 왜 실시간 메시지 상태를 Zustand 로 다루는가?
//
//  - TanStack Query 는 "서버에서 가져온 캐시"를 다루는 데 최적화돼 있다.
//    (요청 → 응답 → 캐시 → 무효화) 흐름. 즉 read 중심의 서버 상태.
//  - 그런데 실시간 메시지는 흐름이 반대다. 서버가 임의의 시점에 push 하고,
//    내가 보낸 메시지는 pending → sent/failed 로 "그 자리에서" 바뀐다.
//    이건 요청-응답 캐시 모델보다 "이벤트로 갱신되는 in-memory 상태"에 가깝다.
//  - 그래서 초기 로딩만 Query 로 하고(Step 3), 이후의 실시간 변화는
//    Zustand 스토어에 모아 둔다. Step 4 의 소켓 이벤트가 이 액션들을 호출한다.
// ─────────────────────────────────────────────────────────────────────────

interface ChatState {
  connectionStatus: ConnectionStatus;
  messages: Message[];

  /** HTTP 초기 메시지(Step 3)를 스토어로 옮겨 담는다. 한 번만 하이드레이션. */
  hydrateMessages: (messages: Message[]) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;

  /** 내가 보낸 메시지를 낙관적(optimistic)으로 추가. status = "pending". */
  addPendingMessage: (message: Message) => void;
  /** echo/ack 수신 시 임시 메시지를 확정 상태로 바꾼다. */
  updateMessageStatus: (id: string, status: MessageStatus) => void;
  /** 상대가 보낸 메시지 등 서버가 push 한 메시지를 끝에 추가. */
  addIncomingMessage: (message: Message) => void;

  /** 테스트/언마운트 정리용. */
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  connectionStatus: "connecting",
  messages: [],

  hydrateMessages: (messages) => set({ messages }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),

  addPendingMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessageStatus: (id, status) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id && m.type === "text" ? { ...m, status } : m,
      ),
    })),

  addIncomingMessage: (message) =>
    set((state) => {
      // 같은 id 가 이미 있으면(내 echo) 중복 추가하지 않는다.
      if (state.messages.some((m) => m.id === message.id)) return state;
      return { messages: [...state.messages, message] };
    }),

  reset: () => set({ connectionStatus: "connecting", messages: [] }),
}));
