import { useEffect, useRef, useState } from "react";
import { useSentMessages, useFailedMessages, useSendingMessages } from "../use-chat/Stores/MessageStore";

import type { MessageContentType } from "../use-chat/useSocket";
import { Message } from "web_component";
import { ScrollArea, Flex, Box } from "@radix-ui/themes";
import { ChatRoom } from "../use-chat/Stores/ChatRoomStore";

const MessageRender = ({messages}: {messages: MessageContentType[]}) => {
    return (
        <>
            {messages.map((val, idx, array) => {
                let senderName: undefined | string = ''
                if (idx > 0 && array[idx-1].senderName === val.senderName && val.direction === 'inbound'){
                    senderName = undefined;
                }
                else {
                    senderName = val.senderName
                }
                if (val.contentType === 'text'){
                   return( 
                         <Message 
                                key={val._id}
                                content={val.content}
                                contentType="text"
                                direction={val.direction}
                                senderName={val.direction === "outgoing" ? undefined : senderName}
                                // @ts-ignore
                                sentAt={new Date(val.createdAt) ?? new Date()}
                                unread={val.unreadCount === 0 ? undefined : val.unreadCount}/>
                        )
                }
            })}
        </>
        )

}


export const ChatContentItemList = ({activeRoom}: {activeRoom?: ChatRoom}) => {
    const scroll = useRef<HTMLDivElement>(null)
    const sentMessages = useSentMessages((state) => state.messages);
    const sentInit = useSentMessages((state) => state.init);
    
    const scrollToBottom = () => {
        
        scroll.current?.scrollTo({
            top: scroll.current?.scrollHeight,
        });
        
        //scroll.current?.scrollIntoView({ block: "start", inline: "end"});
    }

    useEffect(() => {
        console.log("deb", activeRoom)
        sentInit(activeRoom?.chatRoomId ?? undefined);
    }, [activeRoom, sentInit])
    
    useEffect(()=>{
        scrollToBottom();
    }, [sentMessages])

    return (
        <ScrollArea key={activeRoom?.chatRoomId ?? "empty"} scrollbars="vertical" type="hover" ref={scroll}>
            <Flex direction="column" gap="4" minHeight="0" pb="3" height={{initial: "80vw", sm: ""}}>        
                <MessageRender messages={sentMessages}/>
            </Flex>
        </ScrollArea>
    )
}