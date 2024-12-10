import { useEffect } from "react";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { ChatRoomHeader } from "../components/ChatRoomHeader";
import { ChatRooms } from "../components/ChatRooms";
import { Flex, Box } from "@radix-ui/themes";

export const ChatRoomContainer = () => {
    const activeRoom = useChatRoomStore((state) => state.activeRoom);

    return (
        <Box
            flexBasis="20%"
            position={{ initial: "relative", sm: "static" }}
            display={{
                initial: activeRoom === undefined ? "block" : "none",
                sm: "block",
            }}
            height="100vh"
        >
            <ChatRoomHeader />
            <ChatRooms />
        </Box>
    );
};
