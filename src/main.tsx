import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// SEED Design 파운데이션 + 컴포넌트 레시피 CSS.
// all.css 는 토큰(base)과 컴포넌트 레시피를 모두 포함한다.
// (vite 플러그인 없이도 컴포넌트가 스타일링되도록 all.css 를 통째로 불러온다.)
import "@seed-design/css/all.css";
import "./styles/global.css";

import { App } from "./app/App";

// 이 프로젝트는 전부 mock 이므로 항상 MSW 를 켠 뒤 렌더한다.
async function enableMocking() {
  const { worker } = await import("./features/chat/api/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
