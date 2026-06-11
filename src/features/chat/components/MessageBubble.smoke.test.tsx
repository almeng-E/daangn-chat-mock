import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageBubble } from "./MessageBubble";
import type { TextMessage } from "../model/types";

// 이건 "툴체인 스모크 테스트"다. (Vitest + RTL + jsdom 이 도는지 확인)
// 본격적인 Step 6 테스트(메시지 종류별 렌더링 / 전송 흐름)는 직접 작성한다.
// → MessageList.test.tsx, MessageComposer.test.tsx 등을 만들어 보세요.
describe("MessageBubble (smoke)", () => {
  it("text 메시지를 렌더링한다", () => {
    const message: TextMessage = {
      id: "t1",
      roomId: "room-1",
      type: "text",
      senderId: "me",
      text: "안녕하세요",
      createdAt: "2021-04-01T15:42:00+09:00",
    };

    render(<MessageBubble message={message} isMine />);

    expect(screen.getByText("안녕하세요")).toBeInTheDocument();
  });
});
