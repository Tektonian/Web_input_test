import React, {
    MouseEvent,
    MouseEventHandler,
    useEffect,
    useState,
} from "react";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import type { Request, ChatRoom } from "../use-chat/Stores/ChatRoomStore";
import { Box } from "@mui/material";
import { MessageHeader } from "web_component";
/**
 * For modal component
 */
import { useQuery } from "@tanstack/react-query";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { RequestCard } from "web_component";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const ChatContentModal = ({
    activeRoom,
    open,
    setOpen,
}: {
    activeRoom?: ChatRoom;
    open: boolean;
    setOpen: (open: boolean) => void;
}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

    const handleClose = () => {
        setOpen(false);
    };

    const { isPending, isError, data, error, isSuccess } = useQuery({
        queryKey: [activeRoom?.requestId],
        queryFn: async () => {
            if (activeRoom) {
                const res = await fetch(
                    `/api/requests/${activeRoom.requestId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    },
                );

                return res.json();
            }
        },
    });
    console.log(activeRoom);
    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {`요청 정보`}
                </DialogTitle>
                <DialogContent>
                    {isPending ? (
                        <Backdrop
                            sx={(theme) => ({
                                color: "#fff",
                                zIndex: theme.zIndex.drawer + 1,
                            })}
                            open={isPending}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    ) : (
                        <>
                            {isSuccess ? (
                                <RequestCard
                                    title={data.title}
                                    reward_price={data.reward_price}
                                    currency={data.currency}
                                    address={data.address}
                                    start_date={data.start_date}
                                    renderLogo={false}
                                    logo_image={data.logo_image}
                                    request_status={data.request_status}
                                    onClick={() => 0}
                                />
                            ) : (
                                error.message
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export const ChatContentHeader = ({
    activeRoom,
}: {
    activeRoom?: ChatRoom;
}) => {
    const setActiveRoom = useChatRoomStore((state) => state.setActiveRoom);
    const [openModal, setOpenModal] = useState(false);

    const getProviderName = (chatRoom: typeof activeRoom) => {
        if (!chatRoom) {
            return "";
        }
        const consumer = chatRoom?.consumer;
        const providers = chatRoom?.participants;
        if (chatRoom.participants.length === 2) {
            return (
                providers.find((p) => p.user_id !== consumer.user_id)
                    ?.user_name ?? "U"
            );
        }
        return `단체방: ${chatRoom.title}`;
    };

    // <MessageHeader key={activeRoom?.chatRoomId ?? "empty"} onClickArrow={(e: MouseEvent) =>{handleAlert()}} onClickMenu={() => handleClick()} username={activeRoom === undefined ? "" : activeRoom.consumerName}/>
    return (
        <Box flexGrow="0">
            <MessageHeader
                username={getProviderName(activeRoom)}
                onClickArrow={() => setActiveRoom(undefined)}
                onClickUser={() => setOpenModal(true)}
            ></MessageHeader>
            <ChatContentModal
                activeRoom={activeRoom}
                open={openModal}
                setOpen={setOpenModal}
            />
        </Box>
    );
};
