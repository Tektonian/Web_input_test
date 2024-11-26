import { MouseEvent, MouseEventHandler, useEffect } from "react";
import { ChatRoom, useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { MessageHeader } from "web_component";
import { ArrowLeftIcon, DropdownMenuIcon } from "@radix-ui/react-icons"
import { Box, Flex, Separator, Text } from "@radix-ui/themes";
import { Button } from "@mui/joy";
/*
export const ChatContentHeader = () => {
    const activeRoom = useChatRoomStore((state) => state.activeRoom);
    const chatRooms = useChatRoomStore((state) => state.chatRooms);

    const [currentUserAvatar, currentUserName] = useMemo(() => {

        if (activeRoom) {
            const chatRoom = chatRooms.find((val: any) => val.chatRoomId === activeRoom)
            console.log(chatRoom)
            if (chatRoom) {
                return [<Avatar src="https://www.w3schools.com/howto/img_avatar.png"/>, chatRoom.consumerName]
            }
        }
        return [undefined, undefined];
    }, [activeRoom]);

    console.log("ChatContentHeader");
    return (
        <>
            {activeRoom && <ConversationHeader>
                {currentUserAvatar}
                <ConversationHeader.Content userName={currentUserName} />
            </ConversationHeader>}
        </>
    )
}
*/

export const ChatContentHeader = ({activeRoom}: {activeRoom?: ChatRoom}) => {
    const setActiveRoom = useChatRoomStore((state) => state.setActiveRoom);
    const handleClick= () => {
        setActiveRoom(undefined);
    }
    const handleAlert = () => {
        alert("df")
    }

    useEffect(()=>{

    }, [activeRoom?.chatRoomId])

   // <MessageHeader key={activeRoom?.chatRoomId ?? "empty"} onClickArrow={(e: MouseEvent) =>{handleAlert()}} onClickMenu={() => handleClick()} username={activeRoom === undefined ? "" : activeRoom.consumerName}/>
   return (
        <Box pb="2">
            <Flex direction="row" gapX="2" align="center" justify="between" pb="4">
            
            <Button onClick={handleClick} startDecorator={<ArrowLeftIcon />}/>
            
            <Text>{activeRoom?.consumerName}</Text>
            
            <Box flexGrow="1" />
            
            <Button onClick={handleAlert} startDecorator={<DropdownMenuIcon/>} />
            </Flex>
            <Separator orientation="horizontal" size="4" />
        </Box>
    )
}