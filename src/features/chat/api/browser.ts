import { setupWorker } from "msw/browser";
import { handlers } from "./mockHandlers";

// 브라우저(dev)에서 MSW Service Worker 를 띄운다.
// main.tsx 에서 앱을 렌더하기 전에 worker.start() 를 await 한다.
export const worker = setupWorker(...handlers);
