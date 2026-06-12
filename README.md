# 당근 채팅 mock (학습용)

당근마켓 채팅을 흉내 낸 학습용 mock. **네이티브 WebSocket**과 **Zustand**를 직접 손으로
익히는 데 집중한다. 동작하는 ws 서버 + 정적 UI가 주어지고, 실시간 연결/송수신은 직접 구현한다.

## 기술 스택
Vite · React · TypeScript · SEED Design · Zustand · ws(서버) · Vitest + React Testing Library

## 실행
```bash
npm install
npm run server   # ws://localhost:8787
npm run dev      # http://localhost:5173
```

## 테스트
```bash
npm run test
npm run typecheck
```

## 학습 가이드
단계별 학습 루트와 ws 프로토콜, 아키텍처 설명은 **[LEARNING.md](LEARNING.md)** 에 정리되어 있다.
