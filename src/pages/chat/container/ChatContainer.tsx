import { ChatContentHeader } from "../components/ChatContentHeader";
import { ChatContentItemList } from "../components/ChatContentItemList";
import { InputItem } from "../components/InputItem";
import { useSocket } from "../use-chat/useSocket";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { Container } from "@mui/material";
import { useEffect } from "react";
export const ChatContainer = () => {
    const { onSending } = useSocket();
    const activeRoom = useChatRoomStore((state) => state.activeRoom);
    const activeRequest = useChatRoomStore((state) => state.activeRequest);

    return (
        <Container maxWidth="lg">
            <ChatContentHeader
                activeRoom={activeRoom}
                activeRequest={activeRequest}
            />
            <ChatContentItemList
                activeRoom={activeRoom}
                activeRequest={activeRequest}
            />
            <InputItem onSending={onSending} activeRoom={activeRoom} />
        </Container>
    );
};
