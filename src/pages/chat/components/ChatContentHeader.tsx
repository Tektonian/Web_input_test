import { MouseEvent, MouseEventHandler, useEffect } from "react";
import { ChatRoom, useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { MessageHeader } from "web_component";
import { ArrowLeftIcon, DropdownMenuIcon } from "@radix-ui/react-icons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Flex, Separator, Strong, Text } from "@radix-ui/themes";
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

export const ChatContentHeader = ({
    activeRoom,
}: {
    activeRoom?: ChatRoom;
}) => {
    const setActiveRoom = useChatRoomStore((state) => state.setActiveRoom);
    const handleClick = () => {
        setActiveRoom(undefined);
    };
    const handleAlert = () => {
        alert("df");
    };

    useEffect(() => {}, [activeRoom?.chatRoomId]);

    // <MessageHeader key={activeRoom?.chatRoomId ?? "empty"} onClickArrow={(e: MouseEvent) =>{handleAlert()}} onClickMenu={() => handleClick()} username={activeRoom === undefined ? "" : activeRoom.consumerName}/>
    return (
        <Box
            p="1"
            height="5vh"
            style={{
                border: "1px solid #ccc",
                borderColor: "indigo",
                borderLeft: 0,
                borderRight: 0,
                borderTop: 0,
            }}
        >
            <Flex
                direction="row"
                gapX="5"
                align="center"
                justify="between"
                p="2"
            >
                <Button
                    onClick={handleClick}
                    startDecorator={<ArrowBackIcon />}
                >
                    Leave Chat
                </Button>

                <Text>
                    <Strong>{activeRoom?.consumerName}</Strong>
                </Text>

                <Box flexGrow="1" />

                <Button onClick={handleAlert} startDecorator={<MenuIcon />} />
            </Flex>
        </Box>
    );
};
