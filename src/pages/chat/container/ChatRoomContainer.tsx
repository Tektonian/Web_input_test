import { useReducer } from "react";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { ChatRoomHeader } from "../components/ChatRoomHeader";
import { ChatRooms } from "../components/ChatRooms";
import { Container } from "@mui/material";

interface CheckBoxState {
    chatRoomId: string;
    checked: boolean;
}

interface CheckBoxInitAction {
    type: "init";
    initChatRoomIds: string[];
}
interface CheckBoxResetAction {
    type: "reset";
}
interface CheckBoxAction {
    type: "check";
    chatRoomId: string;
    checked: boolean;
}

const checkBoxReducer: React.Reducer<
    CheckBoxState[],
    CheckBoxAction | CheckBoxInitAction | CheckBoxResetAction
> = (state, action) => {
    switch (action.type) {
        case "init": {
            return action.initChatRoomIds.map((id) => ({
                chatRoomId: id,
                checked: false,
            }));
        }
        case "reset":
            return [];

        case "check": {
            const found = state.find(
                (val) => val.chatRoomId === action.chatRoomId,
            );
            const filtered = state.filter(
                (val) => val.chatRoomId !== action.chatRoomId,
            );
            if (!found) {
                return state;
            }
            found.checked = action.checked;
            return [...filtered, found];
        }

        default:
            return state;
    }
};

export const ChatRoomContainer = () => {
    const [state, dispatch] = useReducer(checkBoxReducer, []);

    return (
        <Container maxWidth="sm">
            <ChatRoomHeader state={state} />
            <ChatRooms dispatch={dispatch} />
        </Container>
    );
};
