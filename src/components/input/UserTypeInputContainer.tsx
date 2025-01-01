import React from "react";
import { Box, Card, Container } from "@mui/material";
import { Control } from "react-hook-form";
import {
    BarNavigationCard,
    StudentStepperCard,
    UserTypeInput,
} from "web_component";
import NavigationButtons from "src/pages/student/components/NavigationButtons";

interface UserTypeInputProps {
    onNext: () => void;
    control: Control;
}
const UserTypeInputContainer: React.FC<UserTypeInputProps> = ({
    onNext,
    control,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "24px",
                maxWidth: "1080px",
                margin: "auto",
                padding: "16px",
                minHeight: "100vh",
            }}
        >
            <Container
                sx={{
                    width: { xs: "100%", md: "712px" },
                    padding: "0 !important",
                }}
            >
                <UserTypeInput control={control} />
            </Container>

            <Container
                sx={{
                    width: { xs: "100%", md: "344px" },
                    padding: "0 !important",
                    position: { xs: "relative", md: "sticky" },
                    top: { md: "50%" },
                    transform: { md: "translateY(-50%)" },
                    order: { xs: -1, md: 1 },
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                }}
            >
                <StudentStepperCard currentStep={1} />
                <BarNavigationCard onNext={onNext} onPrevious={() => {}} />
            </Container>
        </Box>
    );
};

export default UserTypeInputContainer;
