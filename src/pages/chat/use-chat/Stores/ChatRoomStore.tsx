import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { safeLocalStorage } from "@toss/storage";
import { TypedStorage } from "@toss/storage/typed";

import type { IMessageStorage } from "./MessageStore";
import type { UseBoundStore, StoreApi } from "zustand";
import type { APIType } from "api_spec";

type ResMessage = APIType.WebSocketType.ResMessage;
type ResRefreshChatRoom = APIType.WebSocketType.ResRefreshChatRoom;
type ResChatRoom = APIType.WebSocketType.ResChatRoom;

export interface ChatUserProfile {
    user_name: string;
    image_url: string;
    user_id: string;
    email: string;
}
export interface ChatRoom {
    title: string;
    requestId: number;
    chatRoomId: string;
    consumer: ChatUserProfile;
    participants: ChatUserProfile[];
    lastReadSeq: number;
    messageSeq: number;
    unreadCount?: number;
    lastSender?: string;
    lastMessage?: string;
    lastSentTime?: Date;
}

export interface Request {
    requestId: number;
    title: string;
    image: string;
    hasUnread: boolean;
    selected: string[];
    requestStatus: number;
}

interface IRequestStorage {
    requests: Request[];
}
interface IChatRoomStorage {
    chatRooms: ChatRoom[];
}

interface ChatRoomStore {
    renderRequest: Request[];
    renderChatRoom: ChatRoom[];
    activeRoom?: ChatRoom;
    activeRequest?: Request;
    initOnLoad: () => void;
    setActiveRequest: (requestId: number) => void;
    tempId?: string;
    setTempId: (id: string) => void;
    socket: Socket;
    setActiveRoom: (chatRoomId?: string) => void;
    setChatRooms: (chatRooms: ChatRoom[]) => void;
    updateOnReceive: (message: ResMessage) => void;
    updateOnRefresh: (res: ResRefreshChatRoom) => void;
}

const chatRoomStorage = new TypedStorage<IChatRoomStorage>("chatroom");
const requestStorage = new TypedStorage<IRequestStorage>("request");

const SetActiveRequest = (
    state: ChatRoomStore,
    requestId?: number,
): ChatRoomStore => {
    const allChatRooms = chatRoomStorage.get()?.chatRooms;
    const allRequests = requestStorage.get()?.requests;
    if (
        !allChatRooms ||
        allChatRooms.filter((val) => val).length === 0 ||
        !allRequests ||
        allRequests.filter((val) => val).length === 0 ||
        !requestId
    ) {
        return state;
    }
    console.log(allChatRooms);
    const renderChatRoom = allChatRooms.filter(
        (room) => room.requestId === requestId,
    );

    const activeRequest = allRequests.find(
        (req) => req.requestId === requestId,
    );

    if (!activeRequest) {
        return state;
    }
    console.log("Set active request", activeRequest, renderChatRoom);
    return {
        ...state,
        renderChatRoom: renderChatRoom,
        activeRequest: activeRequest,
    };
};

const InitOnLoad = (state: ChatRoomStore): ChatRoomStore => {
    const allRequest = requestStorage.get();
    if (!allRequest || allRequest.requests.length === 0) {
        return state;
    }
    console.log(allRequest.requests.at(0));
    // Ahead request
    const request = allRequest.requests.at(0);

    return SetActiveRequest(state, request?.requestId);
};

const SetActiveRoom = (
    state: ChatRoomStore,
    chatRoomId?: string,
): ChatRoomStore => {
    if (chatRoomId === undefined) {
        return {
            ...state,
            activeRoom: undefined,
        };
    }
    const allChatRooms = chatRoomStorage.get()?.chatRooms ?? [];

    const activeRoom = allChatRooms.find(
        (room) => room.chatRoomId === chatRoomId,
    );

    if (!activeRoom) {
        return state;
    }

    chatRoomStorage.set({ chatRooms: allChatRooms });
    return {
        ...state,
        // force rerender
        activeRoom: activeRoom,
        renderChatRoom: state.renderChatRoom,
    };
};

const __UpdateOnReceived = (
    state: ChatRoomStore,
    message: ResMessage,
): ChatRoomStore => {
    const allRequest = requestStorage.get()?.requests;
    let allChatRooms = chatRoomStorage.get()?.chatRooms;
    if (!allChatRooms || !allRequest) {
        return state;
    }

    const msgInRenderChatRoom = state.renderChatRoom.find(
        (room) => room.chatRoomId === message.chatRoomId,
    );

    const msgInRoom = allChatRooms.find(
        (room) => room.chatRoomId === message.chatRoomId,
    );
    if (!msgInRoom) {
        // Will be refreshed
        return state;
    }
    // Not activated request
    else if (!msgInRenderChatRoom) {
        const requestId = msgInRoom.requestId;
        const request = allRequest.find((req) => req.requestId === requestId);
        msgInRoom.messageSeq = message.seq;
        msgInRoom.unreadCount = message.seq - msgInRoom.lastReadSeq;
        request!.hasUnread = true;
        requestStorage.set({ requests: allRequest });
        chatRoomStorage.set({ chatRooms: allChatRooms });
        return {
            ...state,
            renderRequest: allRequest,
        };
    }
    // Not activated chatroom
    else if (msgInRenderChatRoom.chatRoomId !== state.activeRoom?.chatRoomId) {
        msgInRoom.messageSeq = message.seq;
        msgInRoom.unreadCount = message.seq - msgInRenderChatRoom.lastReadSeq;

        msgInRoom.lastMessage = message.content;
        msgInRoom.lastSentTime = new Date(message.createdAt);
    }
    // When participated in
    else if (msgInRenderChatRoom.chatRoomId === state.activeRoom?.chatRoomId) {
        msgInRoom.messageSeq = message.seq;
        msgInRoom.lastReadSeq = message.seq;
        msgInRoom.unreadCount = 0;
        msgInRoom.lastMessage = message.content;
        msgInRoom.lastSentTime = new Date(message.createdAt);
    }

    allChatRooms = allChatRooms.sort((a, b) => {
        const l = a.lastSentTime;
        const r = b.lastSentTime;

        return Number(r) - Number(l);
    });

    chatRoomStorage.set({ chatRooms: allChatRooms });

    const renderChatRoom = allChatRooms.filter(
        (room) => room.requestId === state.activeRequest?.requestId,
    );
    console.log("Render", renderChatRoom);
    console.log("Change", msgInRoom);
    return {
        ...state,
        renderChatRoom: renderChatRoom,
    };
};

const UpdateOnRefresh = (
    state: ChatRoomStore,
    res: ResRefreshChatRoom,
): ChatRoomStore => {
    console.log("Refresh", res);
    const requests = res.requests;
    const chatRooms = res.chatRooms;

    const prevReqeusts = requestStorage.get();
    const prevChatRooms = chatRoomStorage.get();

    const storedRequests: Request[] = requests.map((req: Request) => ({
        ...req,
        hasUnread: true,
    }));

    const storedChatRooms: ChatRoom[] = chatRooms
        .map((room: ChatRoom) => {
            const prevChatRoom = prevChatRooms?.chatRooms.find(
                (prev) => prev.chatRoomId === room.chatRoomId,
            );
            if (!prevChatRoom) {
                return {
                    ...room,
                    unreadCount: room.messageSeq,
                    lastReadSeq: 0,
                };
            }
            return {
                ...room,
                unreadCount: prevChatRoom.messageSeq - prevChatRoom.lastReadSeq,
                lastReadSeq: prevChatRoom.lastReadSeq,
            };
        })
        .filter((val: ChatRoom | null) => val); // remove falsy value
    requestStorage.set({ requests: storedRequests });
    chatRoomStorage.set({ chatRooms: storedChatRooms });

    const renderChatRooms = storedChatRooms.filter(
        (room) => room.requestId === state.activeRequest?.requestId,
    );
    const refreshedRequest = storedRequests.find(
        (req) => req.requestId === state.activeRequest?.requestId,
    );
    if (!state.activeRequest && storedRequests.length === 0) {
        return {
            ...state,
        };
    } else if (state.activeRequest && refreshedRequest) {
        return {
            ...state,
            activeRequest: refreshedRequest,
            renderRequest: [...storedRequests],
            renderChatRoom: renderChatRooms,
        };
    } else {
        return {
            ...state,
            activeRequest: storedRequests.at(0),
            renderRequest: [...storedRequests],
            renderChatRoom: renderChatRooms,
        };
    }
};

export const useChatRoomStore: UseBoundStore<StoreApi<ChatRoomStore>> =
    create<ChatRoomStore>((set) => ({
        renderRequest: [],
        renderChatRoom: [],
        activeRoom: undefined,
        activeRequest: undefined,
        initOnLoad: () => set((state) => InitOnLoad(state)),
        setActiveRequest: (requestId) =>
            set((state) => SetActiveRequest(state, requestId)),
        tempId: undefined,
        setTempId: (id) => set((state) => ({ tempId: id })),
        socket: io("ws://localhost:8080", {
            withCredentials: true,
            path: "/api/chat",
            autoConnect: false,
        }),
        setActiveRoom: (chatRoomId) =>
            set((state) => SetActiveRoom(state, chatRoomId)),
        setChatRooms: (chatRooms) => set(() => ({ renderChatRoom: chatRooms })),
        updateOnReceive: (message) =>
            set((state) => __UpdateOnReceived(state, message)),
        updateOnRefresh: (res) => set((state) => UpdateOnRefresh(state, res)),
    }));
