import { useEffect } from "react";
import { ChatRoom } from "web_component";
import { ScrollArea, Flex } from "@radix-ui/themes";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { useSocket } from "../use-chat/useSocket";
export const ChatRooms = () => {
    const { chatRooms, activeRoom, setActiveRoom } = useChatRoomStore(
        (state) => state,
    );
    const { onJoin, onUnjoin } = useSocket();

    useEffect(() => {}, [chatRooms]);

    useEffect(() => {
        if (activeRoom !== undefined) {
            onJoin(activeRoom.chatRoomId);
        }

        return () => {
            console.log("unjoin", activeRoom);
            onUnjoin();
        };
    }, [activeRoom]);

    return (
        <ScrollArea scrollbars="vertical">
            <Flex direction="column">
                {chatRooms.map((chatRoom, idx) => (
                    <ChatRoom
                        onClick={() => setActiveRoom(chatRoom.chatRoomId)}
                        onContextMenu={() => 0}
                        key={chatRoom.chatRoomId}
                        chatRoomId={chatRoom.chatRoomId}
                        title={chatRoom.consumerName}
                        lastMessage={chatRoom.lastMessage ?? ""}
                        lastSentAt={chatRoom.lastSentTime ?? new Date()}
                        unreadCount={chatRoom.unreadCount ?? 0}
                    />
                ))}
            </Flex>
        </ScrollArea>
    );
};
