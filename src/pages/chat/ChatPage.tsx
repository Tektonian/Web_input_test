import { useState } from "react";
import { useSocket } from "./use-chat/useSocket";
import { ChatContainer } from "./container/ChatContainer";
import { Container, Flex, Box } from "@radix-ui/themes";
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
        <Box height="100vh" overflow="hidden">
            <Flex direction="row">
                <ChatRoomContainer />
                <ChatContainer />
            </Flex>
        </Box>
    );
};

export default ChatPage;
