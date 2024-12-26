import { useMutation } from "@tanstack/react-query";
import {
    useSentMessages,
    useFailedMessages,
    useSendingMessages,
} from "./Stores/MessageStore";
import { useChatRoomStore } from "./Stores/ChatRoomStore";
import { Socket } from "socket.io-client";
import { useSession } from "../../../hooks/Session";
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
        setTempId,
        updateOnReceive,
        updateOnRefresh,
    } = useChatRoomStore((state) => state);
    const session = useSession();

    const pushToSent = useSentMessages((state) => state.push);
    const setSentMessageByIdx = useSentMessages(
        (state) => state.setMessageByIdx,
    );
    const getSentMessageLength = useSentMessages(
        (state) => state.getMessageLength,
    );
    const updateSentUnread = useSentMessages((state) => state.updateUnread);

    const pushToSending = useSendingMessages((state) => state.push);
    const removeSending = useSendingMessages((state) => state.removeMessage);

    const pushToFailed = useFailedMessages((state) => state.push);

    const { mutate, isError, isSuccess } = useMutation({
        mutationFn: async ({
            socket,
            req,
            chatRoomId,
        }: {
            socket: Socket | null;
            req: ReqSendMessage;
            chatRoomId: string;
        }) => {
            if (socket === null) return new Promise(() => null);

            // pushToSending(chatRoomId, req);
            if (req.message.contentType === "text") {
                return await socket.emit("sendMessage", req);
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
        },
    });

    const onJoin = (chatRoomId: string) => {
        socket.on("userJoined", (res, callback) => {
            console.log("Joined to room", res);
            const { messages, lastReadSequences }: ResTryJoin = JSON.parse(res);
            console.log("Joined", messages, lastReadSequences, session);
            const data = messages.map((m) => resMsgToContent(m));
            setSentMessageByIdx(
                chatRoomId,
                data,
                getSentMessageLength(chatRoomId),
            );
            updateSentUnread(chatRoomId, lastReadSequences);
            const lastMsg = messages.at(-1);
            if (lastMsg !== undefined) {
                updateOnReceive(lastMsg);
            }
            // TODO: update device last seq
            callback({
                status: "ok",
            });
        });
        socket.on("someoneSent", (res, callback) => {
            const message: ResMessage = JSON.parse(res);
            console.log("Someone sent message: ", message, " - ", res);

            const data: MessageContent = resMsgToContent(message);

            pushToSent(chatRoomId, data);
            updateOnReceive(message);
            callback({
                id: tempId,
                lastReadSeq: getSentMessageLength(chatRoomId),
                status: "ok",
            });
        });
        socket.on("updateUnread", (res) => {
            const lastReadSequences = res;
            console.log("Updateunread", res);
            updateSentUnread(chatRoomId, lastReadSequences);
        });
        socket.emit("userTryJoin", {
            chatRoomId: chatRoomId,
            deviceLastSeq: getSentMessageLength(chatRoomId),
            id: tempId,
        });
    };

    const onUnjoin = () => {
        socket.off("someoneSent");
        socket.off("updateUnread");
        socket.off("userJoined");
        socket.emit("userTryUnjoin");
    };

    const onSending = (chatRoomId: string, content: MessageContentType) => {
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
            chatRoomId: chatRoomId,
            message: content,
        };

        mutate({ socket: socket, req: req, chatRoomId: chatRoomId });

        return { isError, isSuccess };
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
            console.log("Update chatroom");
            data.direction = "inbound";
            if (activeRoom?.chatRoomId !== data.chatRoomId) {
                console.log("Update chatroom: ", data, ", ", socket.id);
                updateOnReceive(data);
            }
            if (activeRoom !== undefined) {
                // pushToSent(activeRoom.chatRoomId, data);
            }
        });
        socket.connect();
    };
    const onDestroying = () => {
        console.log("Destroying on remove");
        // remove all events
        socket.off();
        socket.disconnect();
    };

    return { onJoin, onUnjoin, onSending, onConnecting, onDestroying };
};
