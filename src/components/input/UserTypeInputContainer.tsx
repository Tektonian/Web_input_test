import React from "react";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { Control } from "react-hook-form";
import {
    BarNavigationCard,
    StudentStepperCard,
    UserTypeInput,
} from "@mesh/web_component";

interface UserTypeInputProps {
    onNext: () => void;
    control: Control;
}
const UserTypeInputContainer: React.FC<UserTypeInputProps> = ({
    onNext,
    control,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "24px",
                maxWidth: "1080px",
                padding: "16px",
                overflow: "hidden",
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                margin: "auto",
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
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                }}
            >
                {!isMobile && <StudentStepperCard currentStep={1} />}
                <BarNavigationCard onNext={onNext} onPrevious={() => {}} />
            </Container>
        </Box>
    );
};

export default UserTypeInputContainer;
