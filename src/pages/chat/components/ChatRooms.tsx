import { useEffect, useState } from "react";
import { ChatRoom } from "web_component";
import { List } from "@mui/material";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { useSocket } from "../use-chat/useSocket";

interface CheckBoxInitAction {
    type: "init";
    initChatRoomIds: string[];
}
interface CheckBoxResetAction {
    type: "reset";
}
interface CheckBoxAction {
    type: "check";
    chatRoomId: string;
    checked: boolean;
}

export const ChatRooms = ({
    dispatch,
}: {
    dispatch: React.Dispatch<
        CheckBoxAction | CheckBoxInitAction | CheckBoxResetAction
    >;
}) => {
    const {
        renderChatRoom,
        activeRequest,
        activeRoom,
        setActiveRoom,
    } = useChatRoomStore((state) => state);
    const { onJoin, onUnjoin } = useSocket();

    const [checkBoxMode, setCheckBoxMode] = useState(false);

    useEffect(() => {
        if (checkBoxMode === true) {
            window.history.pushState(null, "/", window.location.href);
            window.addEventListener("popstate", () => {
                setCheckBoxMode(false);
            });
        }
    }, [checkBoxMode]);

    useEffect(() => {
        const chatRoomIds = renderChatRoom.map((room) => room.chatRoomId);
        dispatch({ type: "init", initChatRoomIds: chatRoomIds });
        setCheckBoxMode(false);
        return () => {
            dispatch({ type: "reset" });
        };
    }, [renderChatRoom]);

    useEffect(() => {
        if (activeRoom !== undefined) {
            onJoin(activeRoom.chatRoomId);
        }

        return () => {
            console.log("unjoin", activeRoom);
            onUnjoin();
        };
    }, [activeRoom]);

    const getProviderName = (chatRoom: typeof renderChatRoom[0]) => {
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
    return (
        <List dense>
            {renderChatRoom.map((chatRoom, idx) => (
                <ChatRoom
                    onClick={(e) => {
                        console.log("Clicked chatroom");
                        setActiveRoom(chatRoom.chatRoomId);
                    }}
                    selected={activeRequest?.selected?.includes(
                        chatRoom.chatRoomId,
                    )}
                    onContextMenu={() => 0}
                    onCheckboxToggle={(event, checked) => {
                        console.log("Checkbox toggle", chatRoom, checked);
                        dispatch({
                            type: "check",
                            chatRoomId: chatRoom.chatRoomId,
                            checked: checked,
                        });
                    }}
                    onLongPress={() => setCheckBoxMode(true)}
                    checkBoxMode={checkBoxMode}
                    key={chatRoom.chatRoomId}
                    title={`${getProviderName(chatRoom)}`}
                    lastMessage={chatRoom.lastMessage ?? ""}
                    lastSentAt={new Date()}
                    unreadCount={chatRoom.unreadCount ?? 0}
                />
            ))}
        </List>
    );
};
