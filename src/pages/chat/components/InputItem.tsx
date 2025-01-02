import { useEffect, useState } from "react";
import { ChatRoom } from "../use-chat/Stores/ChatRoomStore";
import { TextField, Box, Button, Typography, IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useSocketTextMutation } from "../use-chat/useSocket";
import { Message } from "web_component";

import type { APIType } from "api_spec/types";
type MessageContent = APIType.ContentType.MessageContent;
type MessageContentType = APIType.ContentType.MessageContentType;

interface InputItemProps {
    activeRoom: ChatRoom | undefined;
}

export const InputItem = (props: InputItemProps) => {
    const { activeRoom } = props;
    const onTextSending = useSocketTextMutation();
    const [typedString, setTypedString] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewMode, setPreviewmode] = useState(false);

    useEffect(() => {}, [typedString]);

    const handleTextSending = (e: any) => {
        if (
            e.key === "Enter" &&
            e.shiftKey === false &&
            props.activeRoom !== undefined &&
            typedString.length !== 0
        ) {
            e.preventDefault();
            // Use should not be able to send a message.
            // Because if activeRoom is undefined then inputbox should be disabled
            if (props.activeRoom === undefined) {
                return null;
            }

            if (previewMode) return null;

            const isMapLink = typedString.trim().startsWith("https://maps");

            const textContent: MessageContentType = {
                contentType: "text",
                content: typedString,
            };
            setTypedString("");

            onTextSending(textContent);
        }
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewmode(true);
        }
    };

    const handleFileSending = () => {
        if (activeRoom && selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const fileContent: MessageContentType =
                    selectedFile.type.startsWith("image/")
                        ? {
                              contentType: "image",
                              url: "",
                              data: {
                                  // @ts-ignore
                                  name: selectedFile.name,
                                  // @ts-ignore
                                  type: selectedFile.type,
                                  // @ts-ignore
                                  created_at: selectedFile.lastModified,
                                  // @ts-ignore
                                  size: selectedFile.size,
                                  // @ts-ignore
                                  data: arrayBuffer,
                              },
                          }
                        : {
                              contentType: "file",
                              url: "",
                              data: arrayBuffer,
                          };
                console.log("Selected file", selectedFile);
                setSelectedFile(null);
                setPreviewmode(false);
                onSending(activeRoom.chatRoomId, fileContent);
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    };

    const handleCancelPreview = () => {
        setSelectedFile(null);
        setPreviewmode(false);
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
            {/* Preview Area */}
            {previewMode && selectedFile && (
                <Box
                    position="absolute"
                    top="-600%"
                    left="40%"
                    zIndex={1}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="rgba(255, 255, 255, 0.80)"
                    padding={2}
                    borderRadius={1}
                    boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)"
                    width="400px"
                    height="400px"
                >
                    {/* Image Preview */}
                    {selectedFile.type.startsWith("image/") && (
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            style={{
                                maxWidth: "90%",
                                maxHeight: "360px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                marginBottom: "8px",
                            }}
                        />
                    )}

                    {/* File Preview */}
                    {!selectedFile.type.startsWith("image/") && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <InsertDriveFileIcon />
                            <Typography variant="body1">
                                {selectedFile.name}
                            </Typography>
                        </Box>
                    )}

                    {/* Action Buttons */}
                    <Box display="flex" gap={2} mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFileSending}
                        >
                            Send
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancelPreview}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            )}

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
                {/* File Upload Button */}
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="file-upload"
                />
                <label htmlFor="file-upload">
                    <IconButton component="span" color="primary">
                        <UploadFileIcon />
                    </IconButton>
                </label>

                {/* Text Input */}
                <TextField
                    placeholder="Type your message..."
                    fullWidth
                    multiline
                    rows={1}
                    maxRows={3}
                    value={typedString}
                    onChange={(e) => setTypedString(e.target.value)}
                    onKeyDown={handleTextSending}
                    disabled={!activeRoom}
                    sx={{ flexGrow: 1, paddingRight: 2 }}
                />
            </Box>
        </Box>
    );

    /*
    return (
        <InputBox 
            key={activeRoom?.chatRoomId}
            value={typedString}
            onChange={(e)=>{
                console.log("change ypt", e)
                e.preventDefault();
                setTypedString(e.target.value);
            }} 
            onAttachClick={()=>(0)}
            onSend={handleSending} 
            disabled={activeRoom === undefined ? true : false}
            placeholder="Type here..."
        />
    )
    */
};
