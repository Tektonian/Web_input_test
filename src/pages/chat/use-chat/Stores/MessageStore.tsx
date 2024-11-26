import { TypedStorage } from "@toss/storage/typed";
import { create } from "zustand";
import type { MessageContentType } from "../useSocket";

// Big TODO: move to indexedDB later

export interface IMessageStorage {
    messages: MessageContentType[];
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
    messages: MessageContentType[];
    init: (chatRoomId?: string) => void;
    push: (chatRoomId: string, message: MessageContentType) => void;
    getMessageLength: (chatRoomId: string) => number;
    getMessages: (chatRoomId: string) => MessageContentType[];
    updateUnread: (chatRoomId: string, lastReadSeqList: number[]) => void;
    setMessages: (chatRoomId: string, messages: MessageContentType[]) => void;
    setMessageByIdx: (
        chatRoomId: string,
        messages: MessageContentType[],
        idx: number,
    ) => void;
}

const PushMessage = (
    chatRoomId: string,
    oldMessages: MessageContentType[],
    newMessage: MessageContentType,
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
    oldMessages: MessageContentType[],
    newMessages: MessageContentType[],
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
    oldMessages: MessageContentType[],
) => {
    const minSeq = Math.min(...lastReadSeqList);
    const maxSeq = Math.max(...lastReadSeqList);
    const SentMessageStorage = new TypedStorage<IMessageStorage>(
        `sentMessages-${chatRoomId}`,
    );

    // We will not directly modify oldMessages unread count
    // Because there could be contraint that one of the lastReadSeqList could be bigger than length of oldMessages;
    const newSeqList = [];
    for (let i = minSeq; i < maxSeq; i++) {
        let seq = 0;
        for (const j of lastReadSeqList) {
            if (i < j) seq += 1;
        }
        newSeqList.push(seq);
    }
    console.log("old before", oldMessages);
    oldMessages.map((message) => (message.unreadCount = 0));

    newSeqList.reverse();
    console.log("seq", newSeqList);
    for (let i = 0; i < newSeqList.length; i++) {
        if (oldMessages.at(-1 * (i + 1)) !== undefined) {
            // @ts-expect-error
            oldMessages.at(-1 * (i + 1)).unreadCount = newSeqList[i];
        }
    }
    console.log("old after", oldMessages);
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
            messages: UpdateUnread(chatRoomId, lastReadSeqList, state.messages),
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
    messages: MessageContentType[];
    init: (chatRoomId: string) => void;
    push: (chatRoomId: string, message: MessageContentType) => void;
    getMessage: (
        chatRoomId: string,
        messageId: string,
    ) => MessageContentType | undefined;
    removeMessage: (chatRoomId: string, messageId: string) => void;
}

const FilterMessage = (
    chatRoomId: string,
    messages: MessageContentType[] | null,
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
    messages: MessageContentType[] | null,
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
