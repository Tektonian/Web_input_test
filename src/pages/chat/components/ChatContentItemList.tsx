import { useEffect, useRef, useState } from "react";
import {
    useSentMessages,
    useFailedMessages,
    useSendingMessages,
} from "../use-chat/Stores/MessageStore";

import { ScrollArea, Flex, Box } from "@radix-ui/themes";
import { ChatRoom } from "../use-chat/Stores/ChatRoomStore";
import { Message } from "web_component";

import type { APIType } from "api_spec/dist/esm";
type MessageContent = APIType.ContentType.MessageContent;

const MessageRender = ({
    messages,
    activeRoom,
}: {
    messages: MessageContent[];
    activeRoom: ChatRoom;
}) => {
    return (
        <>
            {messages.map((val, idx, array) => {
                const sender = activeRoom.participants.find(
                    (parti) => parti.user_id === val.senderId,
                );
                console.log("Render message", activeRoom, sender, val);
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
                                    : sender?.user_name
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
