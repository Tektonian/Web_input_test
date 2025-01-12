import { useEffect, useState } from "react";
import { useSocket } from "./use-chat/useSocket";
import { ChatContainer } from "./container/ChatContainer";
import { ChatRoomContainer } from "./container/ChatRoomContainer";
import { useChatRoomStore } from "./use-chat/Stores/ChatRoomStore";
import { Container } from "@mui/material";
import { RequestContainer } from "./container/RequestContainer";
import NoRequestAlert from "./components/ChatPage/NoRequestAlert";
const ChatPage = () => {
    const { onConnecting, onDisconnecting } = useSocket();
    const initChatRoom = useChatRoomStore((state) => state.initOnLoad);
    useEffect(() => {
        onConnecting();
        initChatRoom();
        return () => {
            onDisconnecting();
        };
    }, []);

    return (
        <>
            <Container
                fixed
                disableGutters
                sx={{
                    width: "100%",
                    height: {
                        xs: "100vh",
                        md: "500px",
                    },
                    minHeight: {
                        md: "100%",
                    },
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: "2px",
                }}
            >
                <RequestContainer />
                <ChatRoomContainer />
                <ChatContainer />
            </Container>
            <NoRequestAlert />
        </>
    );
};

export default ChatPage;
