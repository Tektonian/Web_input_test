import { create, StoreApi, UseBoundStore } from "zustand";

interface CheckBoxItem {
    chatRoomId: string;
    checked: boolean;
}

interface CheckBoxStore {
    checkBoxMode: boolean;
    changeMode: (mode: boolean) => void;
    checkBoxItem: CheckBoxItem[];
    init: (items: CheckBoxItem[]) => void;
    reset: () => void;
    flip: (chatRoomId: string) => void;
}

const FlipCheck = (items: CheckBoxItem[], chatRoomId?: string) => {
    const item = items.find((val) => val.chatRoomId === chatRoomId);

    if (!item) {
        throw new Error("Item should exist");
    }
    console.log("flip", items);
    item.checked = !item.checked;

    return items;
};

export const useCheckBoxStore: UseBoundStore<StoreApi<CheckBoxStore>> =
    create<CheckBoxStore>((set, get) => ({
        checkBoxMode: false,
        changeMode: (mode) => set(() => ({ checkBoxMode: mode })),
        checkBoxItem: [],
        init: (items) => set(() => ({ checkBoxItem: items })),
        reset: () => set(() => ({ checkBoxItem: [] })),
        flip: (chatRoomId) =>
            set((state) => ({
                checkBoxItem: [...FlipCheck(state.checkBoxItem, chatRoomId)],
            })),
    }));
