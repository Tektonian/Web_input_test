import { useEffect, useState, useRef} from "react";
import { ChatRoom, useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { Flex } from "@radix-ui/themes";
import { Textarea } from "@mui/joy";
import type { TextContent } from "../use-chat/useSocket";

interface InputItemProps {
    onSending: Function;
    activeRoom: ChatRoom | undefined;
}

export const InputItem = (props: InputItemProps) => {
    const {onSending, activeRoom} = props;

    const [typedString, setTypedString] = useState("");

    useEffect(()=>{

    }, [typedString])
    

    const handleSending = (e: any) => {
        if (
            e.key === "Enter" &&
            e.shiftKey === false &&
            props.activeRoom !== undefined &&
            typedString.length !== 0
        ) {
          e.preventDefault();
          // Use should not be able to send a message.
          // Because if activeRoom is undefined then inputbox should be disabled
          if (props.activeRoom === undefined) {
              return null;
          }
          const textContent: TextContent = {
              _id: "-1", // Just for type fitting
              seq: -1,
              direction: 'outgoing', // Just for type fitting 2
              contentType: 'text',
              unreadCount: 0,
              content: typedString,
          }
          setTypedString("");
          
          onSending(activeRoom?.chatRoomId, textContent);
        }
    }
    return (
        <Flex direction="row" align="end" justify="center" gap="2" p="3" flexGrow="1">
            <Textarea 
                key={activeRoom?.chatRoomId}
                value={typedString}
                onChange={(e)=>{
                    e.preventDefault();
                    setTypedString(e.target.value);
                }} 
                onKeyDown={handleSending} 
                disabled={activeRoom === undefined ? true : false}
                placeholder="Type here..."
                sx={{ flex: "1" }}
                minRows={1}
                maxRows={3}
                />
        </Flex>
    )
    /*
    return (
        <InputBox 
            key={activeRoom?.chatRoomId}
            value={typedString}
            onChange={(e)=>{
                console.log("change ypt", e)
                e.preventDefault();
                setTypedString(e.target.value);
            }} 
            onAttachClick={()=>(0)}
            onSend={handleSending} 
            disabled={activeRoom === undefined ? true : false}
            placeholder="Type here..."
        />
    )
    */
}