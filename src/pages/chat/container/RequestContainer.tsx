import { RequestRoom } from "web_component";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { useEffect } from "react";
import { List, Box } from "@mui/material";
export const RequestContainer = () => {
    const { activeRoom, renderRequest, setActiveRequest } = useChatRoomStore(
        (state) => state,
    );

    useEffect(() => {
        console.log("Request", renderRequest);
    }, [renderRequest]);

    return (
        <Box
            flexShrink="0"
            minWidth="40px"
            maxWidth="fit-content"
            width="100%"
            height="100%"
            overflow="auto"
            sx={{
                scrollbarWidth: "none",
                display: {
                    xs: activeRoom === undefined ? "block" : "none",
                    md: "block",
                },
            }}
        >
            <List>
                {renderRequest.map((req) => {
                    return (
                        <RequestRoom
                            key={req.requestId}
                            title={req.title}
                            image={req.image}
                            onClick={() => setActiveRequest(req.requestId)}
                        />
                    );
                })}
            </List>
        </Box>
    );
};
