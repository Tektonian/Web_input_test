import React from "react";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import {
    BarNavigationCard,
    EmailTokenInput,
    StudentStepperCard,
} from "web_component";
import { useForm, useWatch } from "react-hook-form";
import { handleSendVerificationEmail } from "src/hooks/useEmail";

interface CorpInfoInputProps {
    onNext: () => void;
    onPrevious: () => void;
    userType: "student" | "corp" | "orgn";
    consumerData?: { phoneNumber: string; profileId: number };
}
const VerificationContainer: React.FC<CorpInfoInputProps> = ({
    onNext,
    onPrevious,
    userType,
    consumerData,
}) => {
    const { control, handleSubmit } = useForm();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const verifyEmail = useWatch({
        control,
        name: "mail_address",
    });
    const token = useWatch({
        control,
        name: "token",
    });

    const submissionData = {
        type: userType,
        verifyEmail: verifyEmail,
        token: token,
        ...consumerData,
    };

    const onSubmit = async () => {
        try {
            const response = await fetch("/api/callback/identity-verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });
            if (response.ok) {
                const result = await response.json();
                console.log("Data successfully submitted:", result);
            } else {
                console.error(
                    "Failed to submit data:",
                    response.status,
                    await response.text(),
                );
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

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
                height: "100vh",
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
                <EmailTokenInput
                    control={control}
                    onSend={handleSendVerificationEmail}
                    userType={userType}
                />
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
                {!isMobile && <StudentStepperCard currentStep={3} />}
                <BarNavigationCard
                    onNext={handleSubmit(onSubmit)}
                    onPrevious={onPrevious}
                />
            </Container>
        </Box>
    );
};

export default VerificationContainer;
