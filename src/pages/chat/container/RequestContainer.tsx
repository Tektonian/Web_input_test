import { RequestRoom } from "web_component";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { useEffect } from "react";
import { List } from "@mui/material";
export const RequestContainer = () => {
    const {
        activeRequest,
        renderRequest,
        setActiveRequest,
        setActiveRoom,
    } = useChatRoomStore((state) => state);

    useEffect(() => {
        console.log("Request", renderRequest);
    }, [...renderRequest]);

    useEffect(() => {
        setActiveRoom(undefined);
    }, [activeRequest]);
    return (
        <List>
            {renderRequest.map((req) => {
                return (
                    <RequestRoom
                        key={req.requestId}
                        title={req.title}
                        logo_image={req.image}
                        onClick={() => setActiveRequest(req.requestId)}
                    />
                );
            })}
        </List>
    );
};
