import { useEffect, useState } from "react";
import { ChatRoom } from "../use-chat/Stores/ChatRoomStore";
import { TextField, Box, Button, Typography, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSocketTextMutation } from "../use-chat/useSocket";
import { useController, useForm } from "react-hook-form";
import type { APIType } from "api_spec";
type MessageContent = APIType.ContentType.MessageContent;
type MessageContentType = APIType.ContentType.MessageContentType;

interface InputItemProps {
    activeRoom: ChatRoom | undefined;
}

export const InputItem = (props: InputItemProps) => {
    const onTextSending = useSocketTextMutation();
    const { control, getValues, resetField } = useForm<{
        text: string;
    }>();

    const { field } = useController({
        name: "text",
        control: control,
        rules: { required: true },
        defaultValue: "",
    });

    const handleTextSending = () => {
        const text = getValues().text;
        if (text.length !== 0) {
            onTextSending(text);
            resetField("text", { defaultValue: "" });
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (
            e.key === "Enter" &&
            e.shiftKey === false &&
            // 한글 자판 2번 입력되는 버그 해결을 위해
            // ref: https://kimyeongseo.tistory.com/60
            e.nativeEvent.isComposing === false &&
            props.activeRoom !== undefined
        ) {
            e.preventDefault();
            handleTextSending();
            e.stopPropagation();
        }
    };

    return (
        <Box
            flexGrow={0}
            display="flex"
            flexDirection="column"
            alignItems="stretch"
            justifyContent="flex-end"
            gap={2}
            p={2}
            sx={{
                width: "99%",
                position: "relative",
            }}
        >
            {/* Input Area */}
            <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                    position: "relative",
                    zIndex: 0,
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    padding: "8px",
                    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* Text Input */}
                <TextField
                    onKeyDown={handleKeyDown}
                    defaultValue={""}
                    {...field}
                    placeholder="Type your message..."
                    fullWidth
                    multiline
                    maxRows={3}
                />
                <IconButton onClick={handleTextSending}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};
