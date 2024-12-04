import React from "react";
import { ShortTextInput, NavigationButton } from "web_component";
import { useForm } from "react-hook-form";
import { Box, Typography, Container, Grid2 as Grid } from "@mui/material";

export interface StudentEmailInputProps {
    control: any; // 부모 컴포넌트에서 전달받는 control
    onNext: () => void;
    onPrevious: () => void;
    userType: "student" | "corp" | "orgn";
}

const EmailInput: React.FC<StudentEmailInputProps> = ({
    control: externalControl,
    onNext,
    onPrevious,
    userType,
}) => {
    // 독립적인 내부 컨트롤러 생성
    const { control: innerControl } = useForm();

    // 선택적으로 외부 또는 내부 control 사용
    const activeControl =
        userType === "student" ? innerControl : externalControl;

    // TODO: temporary code DELETE later
    const handleNext = () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetch("/api/verification/identity-verify", {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // @ts-ignore
                verifyEmail: activeControl._fields.consumer_email?._f.value,
                type: userType,
            }),
        });
        onNext();
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Enter Your Email
            </Typography>

            <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <ShortTextInput
                            control={activeControl}
                            name="consumer_email"
                            label="Email"
                        />
                    </Grid>
                </Grid>

                <Box display="flex" justifyContent="space-between" mt={3}>
                    <NavigationButton label="previous" onClick={onPrevious} />
                    <NavigationButton label="next" onClick={handleNext} />
                </Box>
            </Box>
        </Container>
    );
};

export default EmailInput;
