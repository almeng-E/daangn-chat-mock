import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageBubble } from "./MessageBubble";
import type { TextMessage } from "../model/types";

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
