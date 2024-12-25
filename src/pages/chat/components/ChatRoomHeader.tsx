import { useNavigate } from "react-router-dom";
import { useChatRoomStore } from "../use-chat/Stores/ChatRoomStore";
import { ChatRoomHeader as ChatRoomHeaderComponent } from "web_component";

interface CheckBoxState {
    chatRoomId: string;
    checked: boolean;
}

export const ChatRoomHeader = ({ state }: { state: CheckBoxState[] }) => {
    const navigate = useNavigate();
    const activeRequest = useChatRoomStore((state) => state.activeRequest);

    const handleBack = () => {
        navigate("/home");
    };

    const handleClick = () => {
        console.log(state);
        for (const s of state) {
            const ret = fetch("http://localhost:8080/api/requests/provider", {
                method: "post",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatroom_id: s.chatRoomId,
                }),
            });
        }
    };
    return (
        <ChatRoomHeaderComponent
            title={activeRequest?.title ?? ""}
            menuItemList={[
                <button onClick={handleClick}>change Provider</button>,
            ]}
            onBackClick={handleBack}
        />
    );
};
