import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { ChatRoomHeader } from "../components/ChatRoomHeader";
import { ChatRooms } from "../components/ChatRooms";
import { Box } from "@mui/material";

export const ChatRoomContainer = () => {
    const activeRoom = useChatRoomStore((state) => state.activeRoom);

    return (
        <Box
            flexShrink="1"
            width="100%"
            height="100%"
            maxWidth={{
                xs: "100%",
                md: "35%",
            }}
            sx={{
                display: {
                    xs: activeRoom === undefined ? "block" : "none",
                    md: "block",
                },
                overflowY: "auto",
                scrollbarWidth: "none",
            }}
        >
            <ChatRoomHeader />
            <ChatRooms />
        </Box>
    );
};
