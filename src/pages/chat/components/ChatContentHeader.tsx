import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import type { Request, ChatRoom } from "../use-chat/Stores/ChatRoomStore";
import { Box } from "@mui/material";
import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { MessageHeader } from "web_component";

interface ModalButtonProps {
    onExist: MouseEventHandler;
    onApprove: MouseEventHandler;
    onDone: MouseEventHandler;
}
const ModalButton = ({ onExist, onApprove, onDone }: ModalButtonProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <Button onClick={onExist}>Exit Room</Button>
                    <Button onClick={onApprove}>Approve</Button>
                    <Button onClick={onDone}>Request Done</Button>
                </ModalDialog>
            </Modal>
        </>
    );
};

export const ChatContentHeader = ({
    activeRequest,
    activeRoom,
}: {
    activeRequest?: Request;
    activeRoom?: ChatRoom;
}) => {
    const setActiveRoom = useChatRoomStore((state) => state.setActiveRoom);
    const handleClick = () => {
        // setActiveRoom("");
    };
    const handleAlert = () => {
        if (activeRoom === undefined) {
            return;
        }
        alert("a");
    };
    const handleExit = () => {
        if (activeRoom === undefined) {
            return;
        }
    };
    const handleApprove = () => {
        if (activeRoom === undefined) {
            return;
        }
        fetch("/api/message/request", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({ chatRoomId: activeRoom.chatRoomId }),
        })
            .then((val) => val)
            .catch((e) => e);
    };
    const handleDone = () => {
        if (activeRoom === undefined) {
            return;
        }
    };

    useEffect(() => {}, [activeRoom?.chatRoomId, activeRequest?.requestId]);
    
    // <MessageHeader key={activeRoom?.chatRoomId ?? "empty"} onClickArrow={(e: MouseEvent) =>{handleAlert()}} onClickMenu={() => handleClick()} username={activeRoom === undefined ? "" : activeRoom.consumerName}/>
    return (
        <Box>
            <MessageHeader
                username={`${activeRequest?.title}-${activeRoom?.title}`}
                onClickArrow={() => 1}
                onClickUser={() => 1}
            ></MessageHeader>
            <ModalButton
                onApprove={handleApprove}
                onDone={handleDone}
                onExist={handleExit}
            />
        </Box>
    );
};
