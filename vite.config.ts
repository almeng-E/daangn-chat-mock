/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 학습용 mock 프로젝트라 빌드 설정은 최소한으로만 둔다.
// - React 플러그인만 사용
// - Vitest 설정을 같은 파일에 둬서 dev/test 환경을 한곳에서 본다.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
