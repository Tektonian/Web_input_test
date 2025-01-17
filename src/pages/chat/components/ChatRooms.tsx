import { ChatRoom } from "@mesh/web_component";
import { List } from "@mui/material";
import { useCheckBoxStore } from "../use-chat/Stores/CheckBoxStore";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { useRequest } from "../use-chat/useRequest";

import type { ChatRoom as ChatRoomType } from "../use-chat/Stores/ChatRoomStore";
export const ChatRooms = () => {
    const { setCheckBoxMode } = useRequest();
    const { flip, checkBoxMode } = useCheckBoxStore((state) => state);

    const { renderChatRoom, setActiveRoom, activeRequest } = useChatRoomStore(
        (state) => state,
    );

    const getProviderName = (chatRoom: ChatRoomType) => {
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
        <List
            dense
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minWidth: "200px",
                flexShrink: "1",
            }}
        >
            {renderChatRoom &&
                renderChatRoom.map((chatRoom, idx) => (
                    <ChatRoom
                        defaultValue={activeRequest?.selected?.includes(
                            chatRoom.chatRoomId,
                        )}
                        onClick={(e) => {
                            console.log("Clicked chatroom", chatRoom);
                            setActiveRoom(chatRoom.chatRoomId);
                        }}
                        selected={activeRequest?.selected?.includes(
                            chatRoom.chatRoomId,
                        )}
                        onContextMenu={() => 0}
                        onCheckboxToggle={(event, checked) => {
                            console.log("Checkbox toggle", chatRoom, checked);
                            flip(chatRoom.chatRoomId);
                        }}
                        onLongPress={() => setCheckBoxMode()}
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
