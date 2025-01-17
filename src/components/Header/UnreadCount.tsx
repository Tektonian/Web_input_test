import { useState, useEffect, MouseEventHandler } from "react";
import { IconButton, Badge, Box } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import { useNavigate } from "react-router-dom";
const UnreadCount = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    /*
    const { mutate, data, isSuccess } = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/message/unread", {
                method: "post",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            return res.json();
        },
        onSuccess: (data, variables, context) => {
            setUnreadCount(data.unreadCount);
        },
    });
    */

    useEffect(() => {
        const eventSource = new EventSource(
            `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/sse`,
            {
                withCredentials: true,
            },
        );
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
            <IconButton
                onClick={() => navigate("/chat")}
                size="large"
                color="inherit"
            >
                <Badge badgeContent={unreadCount ?? 0} color="error">
                    <MailIcon color="action" />
                </Badge>
            </IconButton>
        </Box>
    );
};

export default UnreadCount;
