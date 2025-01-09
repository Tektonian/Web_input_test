import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    InputLabel,
    Link,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { visuallyHidden } from "@mui/utils";

const ButtonDisplayed = ({
    onClick,
    userRole,
}: {
    onClick: React.MouseEventHandler;
    userRole?: "corp" | "orgn" | "student" | "normal";
}) => {
    if (userRole === "normal") {
        return (
            <>
                <InputLabel htmlFor="email-hero" sx={visuallyHidden}>
                    혹시 학생 / 기업인 이신가요?
                </InputLabel>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ minWidth: "fit-content" }}
                    onClick={onClick}
                >
                    인증하기
                </Button>
            </>
        );
    } else if (userRole === "corp" || userRole === "orgn") {
        return (
            <>
                <InputLabel htmlFor="email-hero" sx={visuallyHidden}>
                    요청을 등록해보세요
                </InputLabel>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ minWidth: "fit-content" }}
                    onClick={onClick}
                >
                    요청 작성하기
                </Button>
            </>
        );
    } else if (userRole === "student") {
        return (
            <>
                <InputLabel htmlFor="email-hero" sx={visuallyHidden}>
                    등록된 요청을 확인해보세요
                </InputLabel>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ minWidth: "fit-content" }}
                    onClick={onClick}
                >
                    등록된 요청 보기
                </Button>
            </>
        );
    } else {
        return (
            <>
                <InputLabel htmlFor="email-hero" sx={visuallyHidden}>
                    Email
                </InputLabel>
                <TextField
                    id="email-hero"
                    hiddenLabel
                    size="small"
                    variant="outlined"
                    aria-label="Enter your email address"
                    placeholder="Your email address"
                    fullWidth
                    slotProps={{
                        htmlInput: {
                            autoComplete: "off",
                            "aria-label": "Enter your email address",
                        },
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ minWidth: "fit-content" }}
                    onClick={onClick}
                >
                    메일로 가입하기
                </Button>
            </>
        );
    }
};

const Hero = ({
    userRole,
}: {
    userRole?: "corp" | "orgn" | "student" | "normal";
}) => {
    const navigate = useNavigate();

    const handleStartNow = () => {
        if (userRole === "normal") {
            navigate("/profile/write");
        } else if (userRole === "corp" || userRole === "orgn") {
            navigate("/request/write");
        } else if (userRole === "student") {
            navigate("/request/recommend/list");
        }
    };

    return (
        <Box
            id="hero"
            sx={(theme) => ({
                width: "100%",
                backgroundRepeat: "no-repeat",
                background: `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)`,
                ...theme.applyStyles("dark", {
                    background:
                        "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
                }),
            })}
        >
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pt: { xs: 14, sm: 20 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
                <Stack
                    spacing={2}
                    useFlexGap
                    width="100%"
                    sx={{
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: "center",
                        }}
                    >
                        기업과&nbsp;유학생을&nbsp;
                        <Typography
                            component="span"
                            variant="h2"
                            sx={(theme) => ({
                                fontSize: "inherit",
                                color: "primary.main",
                                ...theme.applyStyles("dark", {
                                    color: "primary.light",
                                }),
                            })}
                        >
                            잇습니다
                        </Typography>
                    </Typography>
                    <Typography
                        variant="h4"
                        align="center"
                        whiteSpace="normal"
                        sx={{
                            color: "text.secondary",
                        }}
                    >
                        세상 모든 유학생이 가교가 될 수 있도록 돕습니다.
                    </Typography>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        useFlexGap
                        sx={{ pt: 2, width: { xs: "100%", sm: "350px" } }}
                    >
                        <ButtonDisplayed
                            onClick={handleStartNow}
                            userRole={userRole}
                        />
                    </Stack>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                    >
                        By clicking &quot;Start now&quot; you agree to our&nbsp;
                        <Link href="#" color="primary">
                            Terms & Conditions
                        </Link>
                        .
                    </Typography>
                    <Box
                        component="img"
                        src="image/homepage.jpg"
                        sx={{ width: "100%" }}
                    />
                </Stack>
            </Container>
        </Box>
    );
};

export default Hero;
