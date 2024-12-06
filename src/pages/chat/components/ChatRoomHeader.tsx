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
        <Box pb="2">
            <Flex
                direction="row"
                align="center"
                justify="between"
                px="3"
                pb="4"
                pt="2"
            >
                {/* 뒤로가기 버튼 */}
                <Button
                    onClick={handleBack}
                    variant="outlined"
                    size="sm"
                    startDecorator={<ArrowBackIcon />}
                >
                    Back
                </Button>

                {/* 새 채팅방 추가 버튼 */}
                <Button
                    variant="outlined"
                    size="sm"
                    startDecorator={<PlusIcon />}
                >
                    New Room
                </Button>
            </Flex>
        </Box>
    );
};
