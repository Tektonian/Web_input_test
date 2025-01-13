import React from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { useRequestQuery } from "../../use-chat/useRequest";
const RequestFinishDiagram = () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (e: React.MouseEvent) => {
        setOpen(true);
    };

    const handleClose = (e: React.MouseEvent) => {
        setOpen(false);
        console.log(
            "Handle alert dialog close",
            e.currentTarget.getAttributeNames(),
        );
        console.log(e.bubbles);
    };

    const { updateStatusFinish } = useRequestQuery();

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                요청 완료
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"고용완료 확인하기"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        요청이 완료되었나요? 요청 완료를 눌러주세요
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>미동의</Button>
                    <Button
                        onClick={() => updateStatusFinish.mutate()}
                        autoFocus
                    >
                        동의
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default RequestFinishDiagram;
