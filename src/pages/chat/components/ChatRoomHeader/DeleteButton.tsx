import React from "react";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

interface DeleteButtonProps {
    onClick: React.MouseEventHandler;
}

const DeleteButton = (props: DeleteButtonProps) => {
    return (
        <IconButton onClick={props.onClick}>
            <Delete />
        </IconButton>
    );
};

export default DeleteButton;
