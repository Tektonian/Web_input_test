import { useEffect, useRef, useState } from "react";
import {
    useSentMessages,
} from "../use-chat/Stores/MessageStore";

import { Container, List } from "@mui/material";
import type { ChatRoom, Request } from "../use-chat/Stores/ChatRoomStore";
import { Message } from "web_component";

import type { APIType } from "api_spec";
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
                            status={0}
                            sentAt={
                                new Date(val.createdAt as Date) ?? new Date()
                            }
                            unread={
                                val.unreadCount === 0
                                    ? undefined
                                    : val.unreadCount
                            }
                        />
                    );
                } else {
                    return (
                        <Message
                            key={val._id}
                            // @ts-ignore
                            content={"sent: " + val.content}
                            contentType="text"
                            direction={val.direction}
                            senderName={
                                val.direction === "outgoing"
                                    ? undefined
                                    : sender?.user_name
                            }
                            status={0}
                            sentAt={
                                new Date(val.createdAt as Date) ?? new Date()
                            }
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
    activeRequest,
    activeRoom,
}: {
    activeRequest?: Request;
    activeRoom?: ChatRoom;
}) => {
    const scroll = useRef<HTMLUListElement>(null);
    const sentMessages = useSentMessages((state) => state.messages);
    const sentInit = useSentMessages((state) => state.init);

    const scrollToBottom = () => {
        scroll.current?.scrollTo({
            top: scroll.current?.scrollHeight,
        });
    };

    useEffect(() => {
        sentInit(activeRoom?.chatRoomId ?? undefined);
    }, [activeRoom, activeRequest, sentInit]);

    useEffect(() => {
        scrollToBottom();
    }, [sentMessages]);

    return (
        <Container sx={{height: "500px"}}>
            <List
                sx={{
                position: 'relative',
                overflow: 'auto',
                maxHeight: '100%',
                '& ul': { padding: 0 },
                }}
                key={activeRoom?.chatRoomId ?? "empty"}
                ref={scroll}
            >
                {activeRoom === undefined ? (
                    <></>
                ) : (
                    MessageRender({
                        messages: sentMessages,
                        activeRoom: activeRoom,
                    })
                )}
            </List>
        </Container>
    );
};
