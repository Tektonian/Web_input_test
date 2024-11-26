import { useEffect } from "react"
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore"
import { ChatRoomHeader } from "../components/ChatRoomHeader"
import { ChatRooms } from "../components/ChatRooms"
import { Flex, Box } from "@radix-ui/themes"
export const ChatRoomContainer = () => {
    const activeRoom = useChatRoomStore((state) => state.activeRoom)

    
    return (
        <Box flexGrow="1" flexBasis="30%" position={{initial: "relative", sm: "static"}} display={{initial: activeRoom === undefined ? 'block' : 'none', sm: 'block'}} height={{initial: "100vh", sm: "56vh"}}>
            <ChatRoomHeader/>
            <ChatRooms />
        </Box>
    )
}