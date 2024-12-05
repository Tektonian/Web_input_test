import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { resMessage } from "../useSocket";
import { safeLocalStorage } from "@toss/storage";
import { TypedStorage } from "@toss/storage/typed";
import { IMessageStorage } from "./MessageStore";

export interface ChatRoom {
    chatRoomId: string;
    consumerId?: string; // deprecated
    consumerName: string;
    providerId?: string; // deprecated
    providerName?: string; // deprecated
    participantNames: string[];
    unreadCount?: number;
    lastSender?: string;
    lastMessage?: string;
    lastSentTime?: Date;
}

export interface ResChatRoom {
    chatRoomId: string;
    consumerName: string;
    providerNames: [string];
    messageSeq: number;
    lastSender: string;
    lastMessage: string;
    lastSentTime: Date;
}

interface IChatRoomStorage {
    chatRooms: ChatRoom[];
}

interface ChatRoomStore {
    chatRooms: ChatRoom[];
    activeRoom?: ChatRoom;
    tempId?: string;
    setTempId: (id: string) => void;
    socket: Socket;
    removeSocket: () => void;
    setActiveRoom: (chatRoomId?: string) => void;
    setChatRooms: (chatRooms: ChatRoom[]) => void;
    removeChatRoom: (chatRoomId: string) => void;
    updateChatRoom: (message: resMessage) => void;
    updateOnConnect: (resChatRooms: ResChatRoom[]) => void;
    setUnread: (chatRoomId: string, unreadCount: number) => void;
}

const chatRoomStorage = new TypedStorage<IChatRoomStorage>("chatroom");

const SetActiveRoom = (chatRooms: ChatRoom[], chatRoomId?: string) => {
    if (chatRoomId === undefined) {
        return undefined;
    }

    const found = chatRooms.find((val) => val.chatRoomId === chatRoomId);
    console.log("activeRooom: ", chatRoomId);
    console.log("chatRooms: ", chatRooms);
    console.log("found: ", found);

    if (found === undefined) {
        return undefined;
    } else {
        found.unreadCount = 0;
        chatRoomStorage.set({ chatRooms: chatRooms });
        return found;
    }
};

const RemoveChatRoom = (chatRooms: ChatRoom[], chatRoomId: string) => {
    const found = chatRooms.findIndex((val) => val.chatRoomId === chatRoomId);
    if (found === undefined) {
        return chatRooms;
    } else {
        const removed = chatRooms.splice(found, 1);
        chatRoomStorage.set({ chatRooms: removed });
        return removed;
    }
};

const SetUnread = (
    chatRooms: ChatRoom[],
    chatRoomId: string,
    unreadCount: number,
) => {
    const found = chatRooms.find((val) => val.chatRoomId === chatRoomId);
    const foundIdx = chatRooms.findIndex(
        (val) => val.chatRoomId === chatRoomId,
    );
    if (found === undefined) {
        return chatRooms;
    } else {
        found.unreadCount = unreadCount;
        const replaced = chatRooms.splice(foundIdx, 1, found);
        chatRoomStorage.set({ chatRooms: replaced });
        return replaced;
    }
};

const UpdateChatRoom = (
    chatRooms: ChatRoom[],
    message: resMessage,
    activeRoom?: ChatRoom,
) => {
    const msgInChatRoom = chatRooms.find(
        (room) => room.chatRoomId === message.chatRoomId,
    );
    console.log("Update chatroom", msgInChatRoom);
    if (msgInChatRoom === undefined) {
        // TODO: add chatroom
        return;
    } else if (
        activeRoom === undefined ||
        msgInChatRoom.chatRoomId !== activeRoom.chatRoomId
    ) {
        msgInChatRoom.lastMessage = message.content;
        msgInChatRoom.unreadCount =
            msgInChatRoom.unreadCount === undefined
                ? 0
                : msgInChatRoom.unreadCount + 1;
        msgInChatRoom.lastSentTime = new Date(message.createdAt);
    } else if (msgInChatRoom.chatRoomId === activeRoom.chatRoomId) {
        msgInChatRoom.lastMessage = message.content;
        msgInChatRoom.lastSentTime = new Date(message.createdAt);
    }

    chatRooms = chatRooms.sort((a, b) => {
        const l = a.lastSentTime ?? new Date(0);
        const r = b.lastSentTime ?? new Date(0);

        return Number(r) - Number(l);
    });

    chatRoomStorage.set({ chatRooms: chatRooms });
    return chatRooms;
};

const UpdateOnConnected = (
    chatRooms: ChatRoom[],
    resChatRooms: ResChatRoom[],
) => {
    const oldChatRoomIds = new Set(chatRooms.map((room) => room.chatRoomId));
    const newChatRoomIds = new Set(resChatRooms.map((room) => room.chatRoomId));

    // @ts-ignore: Typescript does not support Set<string>.difference, so we ignore an error
    oldChatRoomIds.difference(newChatRoomIds).forEach((erasedId: string) => {
        safeLocalStorage.remove(`sentMessages-${erasedId}`);
    });

    const ret: ChatRoom[] = resChatRooms.map((room) => {
        const messageLength =
            new TypedStorage<IMessageStorage>(
                `sentMessages-${room.chatRoomId}`,
            ).get()?.messages.length ?? 0;
        return {
            chatRoomId: room.chatRoomId,
            consumerName: room.consumerName,
            participantNames: [...room.providerNames],
            lastMessage: room.lastMessage,
            lastSentTime: new Date(room.lastSentTime),
            unreadCount: room.messageSeq - messageLength,
        };
    });

    chatRoomStorage.set({ chatRooms: ret });
    return ret;
};

export const useChatRoomStore = create<ChatRoomStore>((set) => ({
    chatRooms: JSON.parse(
        safeLocalStorage.get("chatRooms") ?? "[]",
    ) as ChatRoom[],
    activeRoom: undefined,
    tempId: undefined,
    setTempId: (id) => set((state) => ({ tempId: id })),
    socket: io("ws://localhost:8080", {
        withCredentials: true,
        path: "/api/chat",
        autoConnect: false,
    }),
    removeSocket: () => set((state) => ({ socket: undefined })),
    setActiveRoom: (chatRoomId) =>
        set((state) => ({
            activeRoom: SetActiveRoom(state.chatRooms, chatRoomId),
        })),
    setChatRooms: (chatRooms) => set(() => ({ chatRooms: chatRooms })),
    removeChatRoom: (chatRoomId) =>
        set((state) => ({
            chatRooms: RemoveChatRoom(state.chatRooms, chatRoomId),
        })),
    updateChatRoom: (message) =>
        set((state) => ({
            chatRooms: UpdateChatRoom(
                state.chatRooms,
                message,
                state.activeRoom,
            ),
        })),
    updateOnConnect: (resChatRooms) =>
        set((state) => ({
            chatRooms: UpdateOnConnected(state.chatRooms, resChatRooms),
        })),
    setUnread: (chatRoomId, undreadCount) =>
        set((state) => ({
            chatRooms: SetUnread(state.chatRooms, chatRoomId, undreadCount),
        })),
}));
