import { useState } from "react";
import { useSocket } from "./use-chat/useSocket";
import { ChatContainer } from "./container/ChatContainer";
import { Container, Flex } from "@radix-ui/themes";
import { ChatRoomContainer } from "./container/ChatRoomContainer";
import { useEffect } from "react";

const ChatPage = () => {
    const { onConnecting, onDestroying } = useSocket();

    useEffect(() => {
        onConnecting();
        return () => {
            onDestroying();
        };
    }, []);

    return (
        <Container>
            <Flex direction="row" gap="2">
                <ChatRoomContainer />
                <ChatContainer />
            </Flex>
        </Container>
    );
};

export default ChatPage;
