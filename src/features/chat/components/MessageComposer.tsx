import { type KeyboardEvent, useState } from "react";
import { ActionButton, TextField } from "@seed-design/react";
import "./MessageComposer.css";

interface MessageComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

export function MessageComposer({ onSend, disabled, maxLength = 1000 }: MessageComposerProps) {
  const [text, setText] = useState("");

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(trimmed);
    setText("");
  };

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
