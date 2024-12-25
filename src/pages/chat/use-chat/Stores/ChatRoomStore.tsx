import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { safeLocalStorage } from "@toss/storage";
import { TypedStorage } from "@toss/storage/typed";

import type { IMessageStorage } from "./MessageStore";
import type { UseBoundStore, StoreApi } from "zustand";
import type { APIType } from "api_spec";

type ResMessage = APIType.WebSocketType.ResMessage;
type ResRefreshChatRoom = APIType.WebSocketType.ResRefreshChatRoom;

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
    removeSocket: () => void;
    setActiveRoom: (chatRoomId: string) => void;
    setChatRooms: (chatRooms: ChatRoom[]) => void;
    updateOnReceive: (message: ResMessage) => void;
    updateOnConnect: (resChatRooms: APIType.ChatRoomType.ResChatRoom[]) => void;
    updateOnRefresh: (res: ResRefreshChatRoom) => void;
}

const chatRoomStorage = new TypedStorage<IChatRoomStorage>("chatroom");
const requestStorage = new TypedStorage<IRequestStorage>("request");

const SetActiveRequest = (
    state: ChatRoomStore,
    requestId: number,
): ChatRoomStore => {
    const allChatRooms = chatRoomStorage.get()?.chatRooms;
    const allRequests = requestStorage.get()?.requests
    if (!allChatRooms || !allRequests) {
        return state;
    }

    const renderChatRoom = allChatRooms.filter(
        (room) => room.requestId === requestId,
    );

    renderChatRoom.map((room) => {
        const sentMessages = new TypedStorage<IMessageStorage>(
            `sentMessages-${room.chatRoomId}`,
        ).get();

        room.unreadCount = (sentMessages?.messages?.length ?? room.messageSeq) - room.lastReadSeq;
    });

    const activeRequest = allRequests.find((req) => req.requestId === requestId)

    if(!activeRequest){
        return state;
    }
    console.log("Set active request", activeRequest, renderChatRoom)
    return {
        ...state,
        renderChatRoom: renderChatRoom,
        activeRequest: activeRequest,
    };
};

const InitOnLoad = (state: ChatRoomStore): ChatRoomStore => {
    const allRequest = requestStorage.get();
    if (!allRequest) {
        return state;
    }
    // Ahead request
    const request = allRequest.requests[0];

    return SetActiveRequest(state, request.requestId);
};

const SetActiveRoom = (
    state: ChatRoomStore,
    chatRoomId: string,
): ChatRoomStore => {
    console.log("Set active room", state, chatRoomId)
    const allChatRooms = chatRoomStorage.get()?.chatRooms ?? [];

    const activeRoom = allChatRooms.find(
        (room) => room.chatRoomId === chatRoomId,
    );
    const sentMessages = new TypedStorage<IMessageStorage>(
        `sentMessages-${chatRoomId}`,
    ).get();

    console.log(activeRoom, allChatRooms, sentMessages)
    if (!activeRoom) {
        return state;
    }

    activeRoom.lastReadSeq = sentMessages?.messages?.length ?? 0;
    activeRoom.unreadCount = 0;
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
        // TODO: refresh needed
        return state;
    }
    // Not activated request
    else if (!msgInRenderChatRoom) {
        const requestId = msgInRoom.requestId;
        const request = allRequest.find((req) => req.requestId === requestId);
        request!.hasUnread = true;
        requestStorage.set({ requests: allRequest });
        return {
            ...state,
            renderRequest: allRequest,
        };
    }
    // Not activated chatroom
    else if (
        msgInRenderChatRoom &&
        msgInRenderChatRoom.chatRoomId !== message.chatRoomId
    ) {
        msgInRenderChatRoom.unreadCount =
            message.seq - msgInRenderChatRoom.lastReadSeq;

        msgInRenderChatRoom.lastMessage = message.content;
        msgInRenderChatRoom.lastSentTime = new Date(message.createdAt);
    } 
    // When participated in
    else if (
        msgInRenderChatRoom.chatRoomId === state.activeRoom?.chatRoomId
    ) {
        msgInRoom.lastReadSeq = message.seq;
        msgInRoom.unreadCount = 0;
        msgInRoom.lastMessage = message.content;
        msgInRoom.lastSentTime = new Date(message.createdAt);
    }

    allChatRooms = allChatRooms.sort((a, b) => {
        const l = a.lastSentTime ?? new Date(0);
        const r = b.lastSentTime ?? new Date(0);

        return Number(r) - Number(l);
    });

    chatRoomStorage.set({ chatRooms: allChatRooms });

    const renderChatRoom = allChatRooms.filter(
        (room) => room.requestId === state.activeRequest?.requestId,
    );
    return {
        ...state,
        renderChatRoom: renderChatRoom,
    };
};

const UpdateOnRefresh = (state: ChatRoomStore, res: ResRefreshChatRoom): ChatRoomStore=>{
    console.log("Refresh", res)
    const requests = res.requests;
    const chatRooms = res.chatRooms;

    const prevReqeusts = requestStorage.get();
    const prevChatRooms = chatRoomStorage.get();

    const storedRequests: Request[] = requests.map((req) => ({
        ...req,
        hasUnread: true,
    }))


    const storedChatRooms: ChatRoom[] = chatRooms.map((room) => {
        const prevChatRoom = prevChatRooms?.chatRooms.find((prev) => prev.chatRoomId === room.chatRoomId)

        return {
            ...room,
            lastReadSeq: prevChatRoom?.lastReadSeq ?? 0
        }
    })

    requestStorage.set({requests: storedRequests});
    chatRoomStorage.set({chatRooms: storedChatRooms})

    const renderChatRooms = storedChatRooms.filter((room) => room.requestId === state.activeRequest?.requestId)
    if(!state.activeRequest && storedRequests.length === 0){
        return {
            ...state,
        }
    }
    else if(state.activeRequest && storedRequests.find((req) => req.requestId === state.activeRequest?.requestId)){
        return {
            ...state,
            renderRequest: [...storedRequests],
            renderChatRoom: renderChatRooms,
        }
    }
    else{
        return {
            ...state,
            activeRequest: storedRequests.at(0),
            renderRequest: [...storedRequests],
            renderChatRoom: renderChatRooms,
        }
    }
}


const UpdateOnConnected = (
    chatRooms: ChatRoom[],
    resChatRooms: APIType.ChatRoomType.ResChatRoom[],
) => {
    console.log(chatRooms, resChatRooms);
    /* TS don't support Set<string>.difference
    const oldChatRoomIds = new Set(chatRooms.map((room) => room.chatRoomId));
    const newChatRoomIds = new Set(resChatRooms.map((room) => room.chatRoomId));

    oldChatRoomIds.difference(newChatRoomIds).forEach((erasedId: string) => {
        safeLocalStorage.remove(`sentMessages-${erasedId}`);
    });
    */
    const oldChatRoomIds = chatRooms.map((room) => room.chatRoomId);
    const newChatRoomIds = resChatRooms.map((room) => room.chatRoomId);
    oldChatRoomIds
        .filter((id) => newChatRoomIds.includes(id))
        .forEach((delId) => safeLocalStorage.remove(`sentMessages-${delId}`));

    console.log("Update chatroom on connect: ", resChatRooms);
    const ret: ChatRoom[] = resChatRooms.map((room) => {
        const messageLength =
            new TypedStorage<IMessageStorage>(
                `sentMessages-${room.chatRoomId}`,
            ).get()?.messages?.length ?? 0;
        return {
            title: room.title,
            chatRoomId: room.chatRoomId,
            consumer: room.consumer,
            lastReadSeq: 0,
            // @ts-ignore
            requestId: room.requestId,
            participants: [...room.participants],
            lastMessage: room.lastMessage,
            lastSentTime: new Date(room.lastSentTime),
            unreadCount: room.messageSeq - messageLength,
        };
    });

    chatRoomStorage.set({ chatRooms: ret });
    return ret;
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
        removeSocket: () =>
            set((state) => ({ socket: state.socket.disconnect() })),
        setActiveRoom: (chatRoomId) =>
            set((state) => SetActiveRoom(state, chatRoomId)),
        setChatRooms: (chatRooms) => set(() => ({ renderChatRoom: chatRooms })),
        updateOnReceive: (message) =>
            set((state) => __UpdateOnReceived(state, message)),
        updateOnConnect: (resChatRooms) =>
            set((state) => ({
                renderChatRoom: UpdateOnConnected(
                    state.renderChatRoom,
                    resChatRooms,
                ),
            })),
        updateOnRefresh: (res) => 
            set((state) => UpdateOnRefresh(state, res))
    }));
