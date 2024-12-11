import { TypedStorage } from "@toss/storage/typed";
import { create } from "zustand";
import type { MessageContent } from "../useSocket";

// Big TODO: move to indexedDB later

export interface IMessageStorage {
    messages: MessageContent[];
}

const safeExtract = (messageStorage: TypedStorage<IMessageStorage>) => {
    const extracted = messageStorage.get();
    if (extracted !== null) {
        return extracted.messages;
    } else {
        return [];
    }
};

interface sentMessages {
    messages: MessageContent[];
    init: (chatRoomId?: string) => void;
    push: (chatRoomId: string, message: MessageContent) => void;
    getMessageLength: (chatRoomId: string) => number;
    getMessages: (chatRoomId: string) => MessageContent[];
    updateUnread: (chatRoomId: string, lastReadSeqList: number[]) => void;
    setMessages: (chatRoomId: string, messages: MessageContent[]) => void;
    setMessageByIdx: (
        chatRoomId: string,
        messages: MessageContent[],
        idx: number,
    ) => void;
}

const PushMessage = (
    chatRoomId: string,
    oldMessages: MessageContent[],
    newMessage: MessageContent,
) => {
    const SentMessageStorage = new TypedStorage<IMessageStorage>(
        `sentMessages-${chatRoomId}`,
    );

    oldMessages = [...oldMessages, newMessage];

    SentMessageStorage.set({ messages: oldMessages });

    return oldMessages;
};

const SetMessageByIdx = (
    chatRoomId: string,
    oldMessages: MessageContent[],
    newMessages: MessageContent[],
    idx: number,
) => {
    console.log("setmessages ", [oldMessages.slice(0, idx), ...newMessages]);
    const SentMessageStorage = new TypedStorage<IMessageStorage>(
        `sentMessages-${chatRoomId}`,
    );
    if (oldMessages !== null && oldMessages.length >= idx) {
        const ret = [...oldMessages.slice(0, idx), ...newMessages];
        SentMessageStorage.set({ messages: ret });
        return ret;
    } else {
        SentMessageStorage.set({ messages: oldMessages });
        return oldMessages;
    }
};

const UpdateUnread = (
    chatRoomId: string,
    lastReadSeqList: number[],
    oldMessages: MessageContent[],
) => {
    // Sequence of -1 means that user never participated in a chatroom and read messages;
    // So if minSeq is -1 we should set it as 0
    const minSeq = Math.max(Math.min(...lastReadSeqList), 0);
    const maxSeq = Math.max(...lastReadSeqList);
    const SentMessageStorage = new TypedStorage<IMessageStorage>(
        `sentMessages-${chatRoomId}`,
    );

    // We will not directly modify oldMessages unread count
    // Because there could be contraint that one of the lastReadSeqList could be bigger than length of oldMessages;
    const newUnreadList = [];
    for (let i = minSeq; i < maxSeq; i++) {
        let unread = 0;
        for (const j of lastReadSeqList) {
            if (i > j) unread += 1;
        }
        newUnreadList.push(unread);
    }

    console.log("old before", JSON.parse(JSON.stringify(oldMessages)));
    oldMessages.map((message) => (message.unreadCount = 0));

    newUnreadList.reverse();
    console.log("seq", newUnreadList);
    for (let i = 0; i < newUnreadList.length; i++) {
        if (oldMessages.at(-1 * (i + 1)) !== undefined) {
            // @ts-expect-error
            oldMessages.at(-1 * (i + 1)).unreadCount = newUnreadList[i];
        }
    }
    console.log("old after", JSON.parse(JSON.stringify(oldMessages)));
    SentMessageStorage.set({ messages: oldMessages });
    return oldMessages;
};

export const useSentMessages = create<sentMessages>((set, get) => ({
    messages: [],
    init: (chatRoomId) =>
        set(() => ({
            messages:
                chatRoomId === undefined
                    ? []
                    : safeExtract(
                          new TypedStorage<IMessageStorage>(
                              `sentMessages-${chatRoomId}`,
                          ),
                      ),
        })),
    push: (chatRoomId, message) =>
        set((state) => ({
            messages: PushMessage(chatRoomId, state.messages, message),
        })),
    getMessageLength: (chatRoomId) =>
        new TypedStorage<IMessageStorage>(`sentMessages-${chatRoomId}`).get()
            ?.messages.length ?? 0,
    getMessages: (chatRoomId: string) =>
        safeExtract(
            new TypedStorage<IMessageStorage>(`sentMessages-${chatRoomId}`),
        ),
    updateUnread: (chatRoomId, lastReadSeqList) =>
        set((state) => ({
            messages: [
                // return new array to force redering
                // See: https://zustand.docs.pmnd.rs/apis/create#i%E2%80%99ve-updated-the-state,-but-the-screen-doesn%E2%80%99t-update
                ...UpdateUnread(chatRoomId, lastReadSeqList, state.messages),
            ],
        })),
    setMessages: (chatRoomId, newMessages) =>
        set(() => ({ messages: newMessages })),
    setMessageByIdx: (chatRoomId, newMessages, idx) =>
        set((state) => ({
            messages: SetMessageByIdx(
                chatRoomId,
                state.messages,
                newMessages,
                idx,
            ),
        })),
}));

interface middleStateMessages {
    chatRoomId: string;
    messages: MessageContent[];
    init: (chatRoomId: string) => void;
    push: (chatRoomId: string, message: MessageContent) => void;
    getMessage: (
        chatRoomId: string,
        messageId: string,
    ) => MessageContent | undefined;
    removeMessage: (chatRoomId: string, messageId: string) => void;
}

const FilterMessage = (
    chatRoomId: string,
    messages: MessageContent[] | null,
    messageId: string,
) => {
    if (messages !== null) {
        return messages.filter((val) => val._id === messageId)[0]; //TODO: Id should be unique!!
    } else {
        return undefined;
    }
};

const SpliceMessage = (
    chatRoomId: string,
    messages: MessageContent[] | null,
    messageId: string,
) => {
    if (messages !== null) {
        console.log("Remove message", messages[0], messageId);
        messages.splice(
            messages.findIndex((val) => val._id === messageId),
            1,
        );
        return messages;
    } else {
        return undefined;
    }
};
export const useSendingMessages = create<middleStateMessages>((set, get) => ({
    chatRoomId: "",
    messages: [],
    init: (chatRoomId) =>
        set(() => ({
            messages: safeExtract(
                new TypedStorage<IMessageStorage>(
                    `sendingMessages-${chatRoomId}`,
                ),
            ),
        })),
    push: (chatRoomId, message) =>
        set((state) => ({
            chatRoomId: chatRoomId,
            messages: [...state.messages, message],
        })),
    getMessage: (chatRoomId, messageId) =>
        FilterMessage(chatRoomId, get().messages, messageId),
    removeMessage: (chatRoomId, messageId) =>
        set((state) => ({
            chatRoomId: chatRoomId,
            messages: SpliceMessage(chatRoomId, state.messages, messageId),
        })),
}));

export const useFailedMessages = create<middleStateMessages>((set, get) => ({
    chatRoomId: "",
    messages: [],
    init: (chatRoomId) =>
        set(() => ({
            messages: safeExtract(
                new TypedStorage<IMessageStorage>(
                    `failedMessages-${chatRoomId}`,
                ),
            ),
        })),
    push: (chatRoomId, message) =>
        set((state) => ({
            chatRoomId: chatRoomId,
            messages: [...state.messages, message],
        })),
    getMessage: (chatRoomId, messageId) =>
        FilterMessage(chatRoomId, get().messages, messageId),
    removeMessage: (chatRoomId, messageId) =>
        set((state) => ({
            chatRoomId: chatRoomId,
            messages: SpliceMessage(chatRoomId, state.messages, messageId),
        })),
}));
