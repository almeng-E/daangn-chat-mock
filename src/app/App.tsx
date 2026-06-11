import { AppProviders } from "./providers";
import { ChatRoomPage } from "../pages/ChatRoomPage";
import { MOCK_ROOM_ID } from "../features/chat/model/fixtures";

// 라우터는 아직 없다. 단일 채팅방 화면만 띄운다.
// (다중 채팅방/라우팅은 README 의 "다음 단계 TODO" 참고)
export function App() {
  return (
    <AppProviders>
      <ChatRoomPage roomId={MOCK_ROOM_ID} />
    </AppProviders>
  );
}
