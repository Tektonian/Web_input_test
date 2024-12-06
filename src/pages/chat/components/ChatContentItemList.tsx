import { useEffect, useRef, useState } from "react";
import {
    useSentMessages,
    useFailedMessages,
    useSendingMessages,
} from "../use-chat/Stores/MessageStore";

import type { MessageContentType } from "../use-chat/useSocket";
import { Message } from "web_component";
import { ScrollArea, Flex, Box } from "@radix-ui/themes";
import { ChatRoom } from "../use-chat/Stores/ChatRoomStore";

const MessageRender = ({
    messages,
    activeRoom,
}: {
    messages: MessageContentType[];
    activeRoom: ChatRoom;
}) => {
    return (
        <>
            {messages.map((val, idx, array) => {
                const senderName: undefined | string = "";
                // @ts-ignore
                console.log("Render message", activeRoom, val);
                const sender = activeRoom.participants.find(
                    // @ts-ignore
                    (parti: any) => parti.user_id === val.senderId,
                );
                if (val.contentType === "text") {
                    return (
                        <Message
                            key={val._id}
                            content={"sent: " + val.content}
                            contentType="text"
                            direction={val.direction}
                            senderName={
                                val.direction === "outgoing"
                                    ? undefined
                                    : sender.username
                            }
                            // @ts-ignore
                            sentAt={new Date(val.createdAt) ?? new Date()}
                            unread={
                                val.unreadCount === 0
                                    ? undefined
                                    : val.unreadCount
                            }
                        />
                    );
                }
            })}
        </>
    );
};

export const ChatContentItemList = ({
    activeRoom,
}: {
    activeRoom?: ChatRoom;
}) => {
    const scroll = useRef<HTMLDivElement>(null);
    const sentMessages = useSentMessages((state) => state.messages);
    const sentInit = useSentMessages((state) => state.init);

    const scrollToBottom = () => {
        scroll.current?.scrollTo({
            top: scroll.current?.scrollHeight,
        });

        //scroll.current?.scrollIntoView({ block: "start", inline: "end"});
    };

    useEffect(() => {
        sentInit(activeRoom?.chatRoomId ?? undefined);
    }, [activeRoom, sentInit]);

    useEffect(() => {
        scrollToBottom();
    }, [sentMessages]);

    return (
        <ScrollArea
            key={activeRoom?.chatRoomId ?? "empty"}
            scrollbars="vertical"
            type="hover"
            ref={scroll}
        >
            <Flex
                direction="column"
                gap="4"
                minHeight="0"
                pb="3"
                height={{ initial: "80vw", sm: "" }}
            >
                {activeRoom === undefined ? (
                    <></>
                ) : (
                    MessageRender({
                        messages: sentMessages,
                        activeRoom: activeRoom,
                    })
                )}
            </Flex>
        </ScrollArea>
    );
};
