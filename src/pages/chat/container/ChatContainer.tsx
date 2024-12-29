import { ChatContentHeader } from "../components/ChatContentHeader";
import { ChatContentItemList } from "../components/ChatContentItemList";
import { InputItem } from "../components/InputItem";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { useSentMessages } from "../use-chat/Stores/MessageStore";
import { Stack, Box } from "@mui/material";
import { useEffect } from "react";

export const ChatContainer = () => {
    const activeRoom = useChatRoomStore((state) => state.activeRoom);

    const initSent = useSentMessages((state) => state.init);

    useEffect(() => {
        initSent(activeRoom?.chatRoomId);
    }, [activeRoom]);

    return (
        <Stack
            flex={1}
            minWidth="200px"
            minHeight="300px"
            width="100%"
            height="auto"
            flexDirection="column"
            sx={{
                display: {
                    xs: activeRoom === undefined ? "none" : "flex",
                    md: "flex",
                },
            }}
        >
            {activeRoom === undefined ? (
                <Box width="100%" height="100%"></Box>
            ) : (
                <>
                    <ChatContentHeader activeRoom={activeRoom} />
                    <ChatContentItemList activeRoom={activeRoom} />
                    <InputItem activeRoom={activeRoom} />
                </>
            )}
        </Stack>
    );
};
