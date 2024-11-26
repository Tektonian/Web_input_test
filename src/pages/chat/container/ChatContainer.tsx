import { ChatContentHeader } from "../components/ChatContentHeader";
import { ChatContentItemList } from "../components/ChatContentItemList";
import { InputItem } from "../components/InputItem";
import { useSocket } from "../use-chat/useSocket";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { Flex, Box} from "@radix-ui/themes";

export const ChatContainer = () => {
    const { onSending } = useSocket();
    const activeRoom = useChatRoomStore((state) => state.activeRoom);
    return (
            <Box flexGrow="1" flexBasis="70%" display={{initial: activeRoom === undefined ? "none" : "block", sm: "block"}} height={{initial: "100vh", sm: "56vh"}}>
                <ChatContentHeader activeRoom={activeRoom} />
                <ChatContentItemList activeRoom={activeRoom} />
                <InputItem onSending={onSending} activeRoom={activeRoom}/>
            </Box>
    )
}