import { TypedStorage } from "@toss/storage/typed";
import { create, StoreApi, UseBoundStore } from "zustand";
import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import type { APIType } from "api_spec";
// Big TODO: move to indexedDB later

type MessageContent = APIType.ContentType.MessageContent;
type ResMessage = APIType.WebSocketType.ResMessage;

interface ISentMessageSchema extends DBSchema {
    [chatRoomId: string]: {
        key: number;
        value: MessageContent;
        indexes: { bySeq: number };
    };
}

class MessageStorage {
    private storage: TypedStorage<IMessageStorage> | IDBPDatabase<ISentMessageSchema> | undefined;

    public async initStorage(chatRoomId: string) {
        console.log("Init storage", parseInt("0x" + chatRoomId, 16));
        try {
            this.storage = await openDB<ISentMessageSchema>("sentMessages", 2, {
                upgrade(db: IDBPDatabase<ISentMessageSchema>) {
                    if (process.env.NODE_ENV === "development") {
                        for (const storeName of db.objectStoreNames) {
                            // db.deleteObjectStore(storeName);
                        }
                    }
                    if (db.objectStoreNames.contains(chatRoomId)) {
                        console.log("COntain", chatRoomId);
                        return;
                    }
                    const sentMessageStore = db.createObjectStore(chatRoomId, { keyPath: "seq" });
                    sentMessageStore.createIndex("bySeq", "seq", {
                        unique: true,
                    });
                    console.log("snetMessageStore", sentMessageStore);
                    return;
                },
            });
        } catch (error) {
            console.log("Failed to open db", error);
            this.storage = new TypedStorage<IMessageStorage>(`sentMessages-${chatRoomId}`);
        }
        console.log(this.storage);
        return;
    }

    public async getMessagesBySeq(chatRoomId: string, beginSeq: number, endSeq: number) {
        if (this.storage === undefined) {
            return [];
        } else if (this.storage instanceof TypedStorage) {
            const chatRooms = this.storage.get();
            if (chatRooms === null) {
                return [];
            }
            return chatRooms.messages.slice(beginSeq, endSeq);
        } else {
            const messages: MessageContent[] | undefined = await this.storage.getAllFromIndex(
                chatRoomId,
                "bySeq",
                IDBKeyRange.bound(beginSeq, endSeq),
            );
            //const messages = await this.storage.getAllFromIndex(chatRoomId,'bySeq', IDBKeyRange.bound(beginSeq, endSeq));
            console.log("getAllfROmIndex", messages);
            if (messages === undefined) {
                return [];
            }
            return messages;
        }
    }

    public async getMessageLength(chatRoomId: string) {
        if (this.storage === undefined) {
            return 0;
        } else if (this.storage instanceof TypedStorage) {
            const chatRooms = this.storage.get();
            if (chatRooms === null) {
                return 0;
            }
            return chatRooms.messages.length;
        } else {
            return await this.storage.count(chatRoomId);
        }
    }

    public async getAllMessages(chatRoomId: string) {
        const length = await this.getMessageLength(chatRoomId);
        return this.getMessagesBySeq(chatRoomId, 0, length);
    }

    public async setMessagesByIdx(chatRoomId: string, newMessages: MessageContent[], idx: number) {
        if (this.storage === undefined) {
            return [];
        } else if (this.storage instanceof TypedStorage) {
            const oldMessages = this.storage.get()?.messages;

            if (oldMessages !== undefined && oldMessages.length >= idx) {
                const ret = [...oldMessages.slice(0, idx), ...newMessages];
                this.storage.set({ messages: ret });
                return ret;
            } else {
                this.storage.set({ messages: newMessages });
                return newMessages;
            }
        } else {
            const tx = this.storage.transaction(chatRoomId, "readwrite");
            await Promise.all(newMessages.map((val) => tx.store.put(val)));
            await tx.done;
            return await this.storage.getAll(chatRoomId);
        }
    }

    public async setMessages(chatRoomId: string, messages: MessageContent[]) {
        if (this.storage === undefined) {
            return undefined;
        } else if (this.storage instanceof TypedStorage) {
            this.storage.set({ messages: messages });
        } else {
            await this.storage.clear(chatRoomId);
            const tx = this.storage.transaction(chatRoomId, "readwrite");
            await Promise.all(
                messages.map((val) => {
                    return tx.store.add(val);
                }),
            );
            await tx.done;
        }
    }

    public async push(chatRoomId: string, message: MessageContent) {
        if (this.storage === undefined) {
            return undefined;
        } else if (this.storage instanceof TypedStorage) {
            const oldMessages = this.storage.get()?.messages;
            if (oldMessages === undefined) {
                this.storage.set({ messages: [message] });
            } else {
                this.storage.set({ messages: [...oldMessages, message] });
            }
        } else {
            await this.storage.add(chatRoomId, message);
        }
    }

    public async updateUnread(chatRoomId: string, lastReadSeqList: number[]) {
        if (this.storage === undefined) {
            return [];
        } else if (this.storage instanceof TypedStorage) {
            // Sequence of -1 means that user never participated in a chatroom and read messages;
            // So if minSeq is -1 we should set it as 0
            const minSeq = Math.max(Math.min(...lastReadSeqList), 0);
            const maxSeq = Math.max(...lastReadSeqList);
            const oldMessages = this.storage.get()?.messages;
            if (!oldMessages) {
                return [];
            }
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
                    oldMessages.at(-1 * (i + 1)).unreadCount = newUnreadList[i];
                }
            }
            console.log("old after", JSON.parse(JSON.stringify(oldMessages)));
            this.storage.set({ messages: oldMessages });
            return oldMessages;
        } else {
            const minSeq = Math.max(Math.min(...lastReadSeqList), 0);
            const maxSeq = Math.max(...lastReadSeqList);
            const oldMessages = await this.getMessagesBySeq(chatRoomId, minSeq, maxSeq);

            const newUnreadList: number[] = [];
            for (let i = minSeq; i < maxSeq; i++) {
                let unread = 0;
                for (const j of lastReadSeqList) {
                    if (i > j) unread += 1;
                }
                newUnreadList.push(unread);
            }
            console.log(oldMessages, newUnreadList);
            const all = await this.getAllMessages(chatRoomId);
            console.log(minSeq, maxSeq, all);
            oldMessages.map((message, idx) => (message.unreadCount = newUnreadList[idx]));

            await this.setMessagesByIdx(chatRoomId, oldMessages, minSeq);
            return oldMessages;
        }
    }
}

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
    storage: MessageStorage;
    init: (chatRoomId: string) => Promise<void>;
    push: (chatRoomId: string, message: MessageContent) => Promise<void>;
    updateUnread: (chatRoomId: string, lastReadSeqList: number[]) => Promise<void>;
    setMessages: (chatRoomId: string, messages: MessageContent[]) => Promise<void>;
    setMessageByIdx: (chatRoomId: string, messages: MessageContent[], idx: number) => Promise<void>;
}

const PushMessage = (chatRoomId: string, oldMessages: MessageContent[], newMessage: MessageContent) => {
    const SentMessageStorage = new TypedStorage<IMessageStorage>(`sentMessages-${chatRoomId}`);

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
    const SentMessageStorage = new TypedStorage<IMessageStorage>(`sentMessages-${chatRoomId}`);
    if (oldMessages !== null && oldMessages.length >= idx) {
        const ret = [...oldMessages.slice(0, idx), ...newMessages];
        SentMessageStorage.set({ messages: ret });
        return ret;
    } else {
        SentMessageStorage.set({ messages: oldMessages });
        return oldMessages;
    }
};

const UpdateUnread = (chatRoomId: string, lastReadSeqList: number[], oldMessages: MessageContent[]) => {
    // Sequence of -1 means that user never participated in a chatroom and read messages;
    // So if minSeq is -1 we should set it as 0
    const minSeq = Math.max(Math.min(...lastReadSeqList), 0);
    const maxSeq = Math.max(...lastReadSeqList);
    const SentMessageStorage = new TypedStorage<IMessageStorage>(`sentMessages-${chatRoomId}`);

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
            oldMessages.at(-1 * (i + 1)).unreadCount = newUnreadList[i];
        }
    }
    console.log("old after", JSON.parse(JSON.stringify(oldMessages)));
    SentMessageStorage.set({ messages: oldMessages });
    return oldMessages;
};

const InitChat = async (chatRoomId?: string) => {
    if (!chatRoomId) {
        return [];
    }

    const messages = safeExtract(new TypedStorage<IMessageStorage>(`sentMessages-${chatRoomId}`));
    return messages;
};

export const useSentMessages: UseBoundStore<StoreApi<sentMessages>> = create<sentMessages>((set, get) => ({
    messages: [],
    storage: new MessageStorage(),
    init: async (chatRoomId) => {
        const storage = get().storage;
        await storage.initStorage(chatRoomId);

        const messages = await storage.getAllMessages(chatRoomId);
        set({ messages: messages });
        return;
    },
    push: async (chatRoomId, message) => {
        const storage = get().storage;
        try {
            await storage.push(chatRoomId, message);
            set({ messages: [...get().messages, message] });
        } catch (error) {
            console.log("Push failed", error);
        }
        return;
    },
    updateUnread: async (chatRoomId, lastReadSeqList) => {
        const storage = get().storage;
        try {
            const newMessages = await storage.updateUnread(chatRoomId, lastReadSeqList);
            set({ messages: newMessages });
        } catch (error) {
            console.log("Update unread failed", error);
        }
        return;
    },
    setMessages: async (chatRoomId, newMessages) => {
        const storage = get().storage;
        try {
            await storage.setMessages(chatRoomId, newMessages);
            set({ messages: newMessages });
        } catch (error) {
            console.log("Failed set message", error);
        }
        return;
    },
    setMessageByIdx: async (chatRoomId, newMessages, idx) => {
        const storage = get().storage;
        try {
            const storedMessages = await storage.setMessagesByIdx(chatRoomId, newMessages, idx);
            set({ messages: storedMessages });
        } catch (error) {
            console.log("Set message by idx failed", error);
        }
        return;
    },
}));

interface middleStateMessages {
    chatRoomId: string;
    messages: MessageContent[];
    init: (chatRoomId: string) => void;
    push: (chatRoomId: string, message: MessageContent) => void;
    getMessage: (chatRoomId: string, messageId: string) => MessageContent | undefined;
    removeMessage: (chatRoomId: string, messageId: string) => void;
}

const FilterMessage = (chatRoomId: string, messages: MessageContent[] | null, messageId: string) => {
    if (messages !== null) {
        return messages.filter((val) => val._id === messageId)[0]; //TODO: Id should be unique!!
    } else {
        return undefined;
    }
};

const SpliceMessage = (chatRoomId: string, messages: MessageContent[] | null, messageId: string) => {
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
            messages: safeExtract(new TypedStorage<IMessageStorage>(`sendingMessages-${chatRoomId}`)),
        })),
    push: (chatRoomId, message) =>
        set((state) => ({
            chatRoomId: chatRoomId,
            messages: [...state.messages, message],
        })),
    getMessage: (chatRoomId, messageId) => FilterMessage(chatRoomId, get().messages, messageId),
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
            messages: safeExtract(new TypedStorage<IMessageStorage>(`failedMessages-${chatRoomId}`)),
        })),
    push: (chatRoomId, message) =>
        set((state) => ({
            chatRoomId: chatRoomId,
            messages: [...state.messages, message],
        })),
    getMessage: (chatRoomId, messageId) => FilterMessage(chatRoomId, get().messages, messageId),
    removeMessage: (chatRoomId, messageId) =>
        set((state) => ({
            chatRoomId: chatRoomId,
            messages: SpliceMessage(chatRoomId, state.messages, messageId),
        })),
}));
