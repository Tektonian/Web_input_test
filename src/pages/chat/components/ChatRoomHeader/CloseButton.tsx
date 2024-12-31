import React from "react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface CloseButtonProps {
    onClick: React.MouseEventHandler;
}

const CloseButton = (props: CloseButtonProps) => {
    return (
        <IconButton onClick={props.onClick}>
            <Close />
        </IconButton>
    );
};

export default CloseButton;
