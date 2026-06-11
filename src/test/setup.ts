import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./mswServer";

// MSW 서버 생명주기: 테스트 전체에서 한 번 켜고, 각 테스트 후 핸들러를 초기화한다.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  cleanup(); // RTL 이 렌더한 DOM 정리
});
afterAll(() => server.close());
