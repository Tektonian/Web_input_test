import { useSocket } from "./use-chat/useSocket";
import { ChatContainer } from "./container/ChatContainer";
import { Container, Flex, Box } from "@radix-ui/themes";
import { ChatRoomContainer } from "./container/ChatRoomContainer";
import { useChatRoomStore } from "./use-chat/Stores/ChatRoomStore";
import { useEffect } from "react";
import { RequestContainer } from "./container/RequestContainer";
const ChatPage = () => {
    const { onConnecting, onDestroying } = useSocket();
    const initChatRoom = useChatRoomStore((state) => state.initOnLoad);
    useEffect(() => {
        initChatRoom();
        onConnecting();
        return () => {
            onDestroying();
        };
    }, []);

    return (
        <Box height="100vh" overflow="hidden">
            <Flex direction="row">
                <RequestContainer />
                <ChatRoomContainer />
                <ChatContainer />
            </Flex>
        </Box>
    );
};

export default ChatPage;
