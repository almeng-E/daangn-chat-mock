import { type KeyboardEvent, useState } from "react";
import { ActionButton, TextField } from "@seed-design/react";
import "./MessageComposer.css";

interface MessageComposerProps {
  /** 전송 버튼/Enter 로 메시지를 보낼 때 호출. 부모가 실제 전송 로직을 갖는다. */
  onSend: (text: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

// 입력창 값은 이 컴포넌트 내부에서만 쓰는 값이라 Zustand 가 아니라 local state 로 둔다.
// (모든 상태를 전역 스토어에 넣지 않는다 — 지역 상태로 충분한 건 지역에.)
export function MessageComposer({ onSend, disabled, maxLength = 1000 }: MessageComposerProps) {
  const [text, setText] = useState("");

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && !disabled; // 빈 메시지는 전송 불가

  const handleSend = () => {
    if (!canSend) return;
    onSend(trimmed);
    setText("");
  };

  // Enter = 전송, Shift+Enter = 줄바꿈 (메신저 관습)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="composer">
      <TextField.Root className="composer__field" value={text} onValueChange={setText}>
        <TextField.Textarea
          placeholder="메시지를 입력해요"
          aria-label="메시지 입력"
          maxLength={maxLength}
          onKeyDown={handleKeyDown}
        />
      </TextField.Root>

      <div className="composer__actions">
        <span className="composer__count">
          {text.length}/{maxLength}
        </span>
        <ActionButton type="button" size="small" disabled={!canSend} onClick={handleSend}>
          전송
        </ActionButton>
      </div>
    </div>
  );
}
