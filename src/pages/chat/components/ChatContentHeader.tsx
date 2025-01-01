import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import type { Request, ChatRoom } from "../use-chat/Stores/ChatRoomStore";
import { Box } from "@mui/material";
import { MessageHeader } from "web_component";


export const ChatContentHeader = ({
    activeRoom,
}: {
    activeRoom?: ChatRoom;
}) => {
    const setActiveRoom = useChatRoomStore((state) => state.setActiveRoom);

    const getProviderName = (chatRoom: typeof activeRoom) => {
        if(!chatRoom){
            return ""
        }
        const consumer = chatRoom?.consumer;
        const providers = chatRoom?.participants;
        if (chatRoom.participants.length === 2) {
            return (
                providers.find((p) => p.user_id !== consumer.user_id)
                    ?.user_name ?? "U"
            );
        }
        return `단체방: ${chatRoom.title}`;
    };

    // <MessageHeader key={activeRoom?.chatRoomId ?? "empty"} onClickArrow={(e: MouseEvent) =>{handleAlert()}} onClickMenu={() => handleClick()} username={activeRoom === undefined ? "" : activeRoom.consumerName}/>
    return (
        <Box flexGrow="0">
            <MessageHeader
                username={getProviderName(activeRoom)}
                onClickArrow={() => setActiveRoom(undefined)}
                onClickUser={() => 1}
            ></MessageHeader>
        </Box>
    );
};
