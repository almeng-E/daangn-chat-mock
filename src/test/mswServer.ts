import { setupServer } from "msw/node";
import { handlers } from "../features/chat/api/mockHandlers";

// 테스트(Vitest, node 환경)에서는 Service Worker 대신 node 용 서버로 가로챈다.
// 브라우저와 같은 handlers 를 재사용한다.
export const server = setupServer(...handlers);
