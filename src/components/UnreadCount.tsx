import { useState, useEffect, MouseEventHandler } from "react";
import { Badge, IconButton, Box } from "@mui/joy";
import { Mail } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
interface UnreadCountProps {
    onClick: MouseEventHandler<HTMLAnchorElement>;
}
const UnreadCount = ({ onClick }: UnreadCountProps) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:8080/api/sse", {
            withCredentials: true,
        });
        console.log("eventSource: ", eventSource);
        eventSource.onmessage = (event) => {
            console.log("onmessage", event);
            setUnreadCount(JSON.parse(event.data).unreadTotalCount);
        };

        eventSource.addEventListener("alarm", (event) => {
            console.log("event", event);
            setUnreadCount(JSON.parse(event.data).unreadTotalCount);
        });
        return () => eventSource.close();
    }, []);

    return (
        <Box>
            <IconButton onClick={onClick}>
                <Badge badgeContent={unreadCount}>
                    <Mail sx={{ fontSize: "xl" }} />
                </Badge>
            </IconButton>
        </Box>
    );
};

export default UnreadCount;
