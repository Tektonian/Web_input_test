import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    useSentMessages,
    useFailedMessages,
    useSendingMessages,
} from "./Stores/MessageStore";
import { useChatRoomStore } from "./Stores/ChatRoomStore";
import { Socket } from "socket.io-client";
import { APIType } from "api_spec";

type ReqSendMessage = APIType.WebSocketType.ReqSendMessage;
type MessageContentType = APIType.ContentType.MessageContentType;
type MessageContent = APIType.ContentType.MessageContent;
type ResMessage = APIType.WebSocketType.ResMessage;
type ResTryJoin = APIType.WebSocketType.ResTryJoin;

const resMsgToContent = (message: ResMessage): MessageContent => {
    if (message.contentType === "text") {
        return {
            _id: message._id,
            seq: message.seq,
            unreadCount: message.unreadCount,
            direction: message.direction,
            senderId: message.senderId,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            contentType: message.contentType,
            content: message.content,
        };
    } else {
        // @ts-ignore
        return {
            _id: message._id,
            seq: message.seq,
            unreadCount: message.unreadCount,
            direction: message.direction,
            senderId: message.senderId,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            // @ts-ignore
            contentType: message.contentType,
            content: "",
            url: "",
        };
    }
};

export const useSocket = () => {
    const {
        socket,
        tempId,
        activeRoom,
        activeRequest,
        setTempId,
        setActiveRoom,
        updateOnReceive,
        updateOnRefresh,
    } = useChatRoomStore((state) => state);

    const pushToSent = useSentMessages((state) => state.push);
    const initSentStorage = useSentMessages((state) => state.init);
    const setSentMessageByIdx = useSentMessages(
        (state) => state.setMessageByIdx,
    );
    const updateSentUnread = useSentMessages((state) => state.updateUnread);

    const onJoin = async (chatRoomId: string) => {
        socket.once("userJoined", (callback) => {
            console.log("User joined");
            console.log("Set active room", chatRoomId);
            callback({ status: "ok" });
        });

        socket.on("someoneSent", (res, callback) => {
            const message: ResMessage = JSON.parse(res);
            console.log(
                "Someone sent message: ",
                message,
                " - ",
                res,
                " - ",
                socket.id,
            );

            const data: MessageContent = resMsgToContent(message);

            pushToSent(chatRoomId, data)
                .then(() => {
                    updateOnReceive(message);
                })
                .catch((error) => {
                    console.log("Sending failed", error);
                });
            callback({
                id: tempId,
                lastReadSeq: data.seq,
                status: "ok",
            });
        });
        socket.on("updateUnread", async (res) => {
            const lastReadSequences = res;
            console.log("Updateunread", res);
            await updateSentUnread(chatRoomId, lastReadSequences);
        });

        try {
            const res = await socket.timeout(500).emitWithAck("userTryJoin", {
                chatRoomId: chatRoomId,
                deviceLastSeq: 0, // TODO: fix index
                id: tempId,
            });
            console.log("User try join", res);
            await initSentStorage(chatRoomId);
            const { messages, lastReadSequences }: ResTryJoin = JSON.parse(res);
            const data = messages.map((m: ResMessage) => resMsgToContent(m));
            await setSentMessageByIdx(chatRoomId, data, 0); // TODO: fix index

            await updateSentUnread(chatRoomId, lastReadSequences);
            const lastMsg = messages.at(-1);
            if (lastMsg !== undefined) {
                updateOnReceive(lastMsg);
            }
        } catch (error) {
            console.log("User failed to join a room", chatRoomId);
            setActiveRoom(undefined);
            return;
        }
    };

    const onUnjoin = () => {
        console.log("User unjoin");
        socket.off("someoneSent");
        socket.off("updateUnread");
        socket.emit("userTryUnjoin");
    };

    const onConnecting = () => {
        socket.once("connected", (res, callback) => {
            console.log("Chat user tmp ID: ", res);
            setTempId(res.id);
            updateOnRefresh({
                chatRooms: res.chatRooms,
                requests: res.requests,
            });
            callback({
                id: res.id,
                status: "ok",
            });
        });

        socket.on("refreshChatRooms", (res) => {
            console.log("Refresh chatrooms", res);
            updateOnRefresh(res);
        });

        socket.on("updateChatRoom", (res, callback) => {
            const data = JSON.parse(res);
            console.log("Update chatroom: ", data, ", ", socket.id);
            updateOnReceive(data);
            if (activeRoom?.chatRoomId !== data.chatRoomId) {
                //updateOnReceive(data);
            }
            if (activeRoom !== undefined) {
                // pushToSent(activeRoom.chatRoomId, data);
            }
        });

        socket.on("disconnect", (reason, detail) => {
            console.log("Socket disconnected", reason, detail);
        });
        socket.connect();
    };
    const onDisconnecting = () => {
        console.log("Destroying on remove");
        // remove all events
        socket.off();
        socket.disconnect();
        setActiveRoom(undefined);
    };

    useEffect(() => {
        if (activeRoom) {
            if (activeRoom.chatRoomId) {
                console.log("Join", activeRoom);
                onJoin(activeRoom.chatRoomId)
                    .then()
                    .catch(() => 1);
            }
        }
        return () => {
            if (activeRoom) {
                onUnjoin();
            }
        };
    }, [activeRoom]);

    useEffect(() => {
        setActiveRoom(undefined);
    }, [activeRequest]);

    return { onJoin, onUnjoin, onConnecting, onDisconnecting };
};

export const useSocketTextMutation = () => {
    const { socket, activeRoom, tempId } = useChatRoomStore((state) => state);
    const pushToSending = useSendingMessages((state) => state.push);
    const removeSending = useSendingMessages((state) => state.removeMessage);

    const pushToFailed = useFailedMessages((state) => state.push);

    const { mutate, isError, isSuccess } = useMutation({
        mutationFn: async ({
            socket,
            req,
        }: {
            socket: Socket | null;
            req: ReqSendMessage;
        }) => {
            if (socket === null) return new Promise(() => null);

            // pushToSending(chatRoomId, req);
            if (req.message.contentType === "text") {
                return socket.timeout(3000).emitWithAck("sendMessage", req);
            } else if (req.message.contentType === "file") {
            } else if (req.message.contentType === "image") {
            } else if (req.message.contentType === "map") {
            } else {
                throw new Error("Wrong type");
            }
        },
        onError: (error, variables, context) => {
            // removeSending(variables.chatRoomId, variables.req._id);
            // pushToFailed(variables.chatRoomId, variables.req.content);
            console.log("error: ", error);
        },
        onSuccess: (data, variables, context) => {
            console.log("success", data);
            console.log("success context", context);
            console.log("success context", variables);
            // remove sending message with variables
            // removeSending(variables.chatRoomId, variables.req._id);
            // add received message from server
        },
        onSettled: (data, error, variables, context) => {
            // Error or success... doesn't matter
            console.log("WHen sending", data, error);
        },
    });

    const onTextSending = (content: MessageContentType) => {
        if (activeRoom === undefined) {
            console.log("Sending on no activeRoom");
            return undefined;
        }
        if (tempId === undefined) {
            return undefined;
        }
        console.log("On sending", content);
        const req: ReqSendMessage = {
            _id: Math.floor(Math.random() * 100000).toString(),
            senderId: tempId,
            chatRoomId: activeRoom.chatRoomId,
            message: content,
        };

        mutate({ socket: socket, req: req });

        return { isError, isSuccess };
    };

    return onTextSending;
};
