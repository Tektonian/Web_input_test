import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useChatRoomStore } from "../../use-chat/Stores/ChatRoomStore";
import { useSession } from "../../../../hooks/Session";
import { useNavigate } from "react-router-dom";

const NoRequestAlert = () => {
    const [open, setOpen] = React.useState(false);
    const session = useSession({ required: false });
    const navigate = useNavigate();
    const renderRequest = useChatRoomStore((state) => state.renderRequest);

    React.useEffect(() => {
        if (renderRequest !== undefined && renderRequest.length === 0) {
            setOpen(true);
        }
    }, [renderRequest]);

    const isStudent = new Set(session.data?.user?.roles).has("student");
    const location = isStudent ? "/request/recommend/list" : "/request/write";

    const message = isStudent
        ? "학생이신가요? 추천 요청 목록을 확인해보세요!"
        : "아직 신청한 요청이 없는 것 같아요";
    const buttonMessage = isStudent
        ? "추천 요청 확인하기"
        : "요청 작성하러 가기";

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{message}</DialogTitle>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        onClick={() => {
                            handleClose();
                            navigate(location);
                        }}
                        autoFocus
                        variant="contained"
                    >
                        {buttonMessage}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default NoRequestAlert;
