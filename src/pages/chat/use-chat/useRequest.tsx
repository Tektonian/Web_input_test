import { useEffect } from "react";
import { useCheckBoxStore } from "./Stores/CheckBoxStore";
import { useChatRoomStore } from "./Stores/ChatRoomStore";
import { useMutation } from "@tanstack/react-query";

export const useRequest = () => {
    const { checkBoxMode, changeMode, init } = useCheckBoxStore(
        (state) => state,
    );
    const { activeRoom, setActiveRoom, renderChatRoom, activeRequest } =
        useChatRoomStore((state) => state);

    useEffect(() => {
        if (checkBoxMode === true) {
            window.history.pushState(null, "/", window.location.href);
            window.addEventListener("popstate", () => {
                changeMode(false);
            });
        }

        if (checkBoxMode === false && activeRoom !== undefined) {
            window.history.pushState(null, "/", window.location.href);
            window.addEventListener("popstate", () => {
                setActiveRoom(undefined);
            });
        }
    }, [checkBoxMode, activeRoom]);

    useEffect(() => {
        const chatRoomIds = renderChatRoom.map((room) => room.chatRoomId);

        const checkBoxItems = chatRoomIds.map((id) => {
            return {
                chatRoomId: id,
                checked: false,
            };
        });

        changeMode(false);
        init(checkBoxItems);
    }, [renderChatRoom]);

    const setCheckBoxMode = () => {
        const selected = activeRequest?.selected;

        if (!selected || !activeRequest || activeRequest.requestStatus >= 3) {
            return;
        }

        const chatRoomIds = renderChatRoom.map((room) => room.chatRoomId);

        const checkBoxItems = chatRoomIds.map((id) => {
            return {
                chatRoomId: id,
                checked: selected.includes(id),
            };
        });

        init(checkBoxItems);
        changeMode(true);
    };

    return { setCheckBoxMode };
};

export const useRequestQuery = () => {
    const checkBoxItem = useCheckBoxStore((state) => state.checkBoxItem);
    const activeRequest = useChatRoomStore((state) => state.activeRequest);

    const updateProvider = useMutation({
        mutationFn: async () => {
            const checkedItems = checkBoxItem
                .filter((item) => item.checked === true)
                .map((item) => item.chatRoomId);

            const res = await fetch(
                `${process.env.REACT_APP_SERVER_BASE_URL}/api/requests/provider`,
                {
                    method: "post",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        chatroom_ids: checkedItems,
                        request_id: activeRequest?.requestId,
                    }),
                },
            );

            return res;
        },
    });

    const updateStatusContract = useMutation({
        mutationFn: async () => {
            const res = await fetch(
                `${process.env.REACT_APP_SERVER_BASE_URL}/api/requests/status/contract`,
                {
                    method: "post",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        request_id: activeRequest?.requestId,
                    }),
                },
            );

            return res;
        },
    });

    const updateStatusFinish = useMutation({
        mutationFn: async () => {
            const res = await fetch(
                `${process.env.REACT_APP_SERVER_BASE_URL}/api/requests/status/finish`,
                {
                    method: "post",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        request_id: activeRequest?.requestId,
                    }),
                },
            );

            return res;
        },
    });

    return { updateProvider, updateStatusContract, updateStatusFinish };
};
