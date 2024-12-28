import { ChatContentHeader } from "../components/ChatContentHeader";
import { ChatContentItemList } from "../components/ChatContentItemList";
import { InputItem } from "../components/InputItem";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { useSentMessages } from "../use-chat/Stores/MessageStore";
import { Stack, Box } from "@mui/material";
import { useEffect, useState } from "react";

interface ChatContainerProps {
    onTextSending: Function;
}
export const ChatContainer = (props: ChatContainerProps) => {
    const activeRoom = useChatRoomStore((state) => state.activeRoom);
    const activeRequest = useChatRoomStore((state) => state.activeRequest);

    const initSent = useSentMessages((state) => state.init);

    useEffect(() => {
        initSent(activeRoom?.chatRoomId);
    }, [activeRoom]);

    return (
        <Stack
            flex={1}
            minWidth="200px"
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
            <ChatContentHeader activeRoom={activeRoom} />
            <ChatContentItemList activeRoom={activeRoom} />
            <InputItem
                onSending={props.onTextSending}
                activeRoom={activeRoom}
            />
        </Stack>
    );
};
