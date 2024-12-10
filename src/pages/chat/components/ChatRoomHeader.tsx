import { Flex, Box, Separator, Text } from "@radix-ui/themes";
import { Button } from "@mui/joy";
import { PlusIcon } from "@radix-ui/react-icons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export const ChatRoomHeader = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/home");
    };

    return (
        <Box
            p="1"
            height="5vh"
            style={{
                border: "1px solid #ccc",
                borderColor: "indigo",
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
            }}
        >
            <Flex direction="row" align="center" justify="between" p="3">
                {/* 뒤로가기 버튼 */}
                <Button
                    onClick={handleBack}
                    variant="outlined"
                    size="sm"
                    startDecorator={<ArrowBackIcon />}
                    style={{
                        backgroundColor: "white",
                        color: "black",
                        borderColor: "indigo",
                    }}
                >
                    Back
                </Button>
            </Flex>
        </Box>
    );
};
