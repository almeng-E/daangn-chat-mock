import { ChatRoomPage } from "../pages/ChatRoomPage";
import { MOCK_ROOM_ID } from "../features/chat/model/fixtures";

export function App() {
  return <ChatRoomPage roomId={MOCK_ROOM_ID} />;
}
