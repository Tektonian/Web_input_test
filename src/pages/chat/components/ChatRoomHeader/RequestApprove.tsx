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
const RequestApproveDiagram = () => {
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

    const { updateStatusContract } = useRequestQuery();

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                인원 모집 마감하기
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
                        고용 완료 후에는 학생을 바꾸기 어렵습니다. 요청을
                        수락하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>미동의</Button>
                    <Button
                        onClick={() => updateStatusContract.mutate}
                        autoFocus
                    >
                        동의
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default RequestApproveDiagram;
