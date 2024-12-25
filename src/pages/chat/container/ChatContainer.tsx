import { ChatContentHeader } from "../components/ChatContentHeader";
import { ChatContentItemList } from "../components/ChatContentItemList";
import { InputItem } from "../components/InputItem";
import { useSocket } from "../use-chat/useSocket";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { Container } from "@mui/material";
export const ChatContainer = () => {
    const { onSending } = useSocket();
    const activeRoom = useChatRoomStore((state) => state.activeRoom);
    return (
        <Container maxWidth="lg">
            <ChatContentHeader activeRoom={activeRoom} />
            <ChatContentItemList activeRoom={activeRoom} />
            <InputItem onSending={onSending} activeRoom={activeRoom} />
        </Container>
    );
};
