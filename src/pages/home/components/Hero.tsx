import * as React from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "../../../hooks/Session";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

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
                    Start now
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
            navigate("/profileinput");
        } else if (userRole === "corp" || userRole === "orgn") {
            navigate("/requestinput");
        } else if (userRole === "student") {
            navigate("/request-list");
        }
    };

    const handleRequestNow = () => {
        navigate("/requestinput");
    };

    return (
        <Box
            id="hero"
            sx={(theme) => ({
                width: "100%",
                backgroundRepeat: "no-repeat",
                backgroundImage:
                    "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
                ...theme.applyStyles("dark", {
                    backgroundImage:
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
                    sx={{
                        alignItems: "center",
                        width: { xs: "100%", sm: "70%" },
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: "center",
                            fontSize: "clamp(3rem, 10vw, 3.5rem)",
                        }}
                    >
                        Our&nbsp;latest&nbsp;
                        <Typography
                            component="span"
                            variant="h1"
                            sx={(theme) => ({
                                fontSize: "inherit",
                                color: "primary.main",
                                ...theme.applyStyles("dark", {
                                    color: "primary.light",
                                }),
                            })}
                        >
                            products
                        </Typography>
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "center",
                            color: "text.secondary",
                            width: { sm: "100%", md: "80%" },
                        }}
                    >
                        Explore our cutting-edge dashboard, delivering
                        high-quality solutions tailored to your needs. Elevate
                        your experience with top-tier features and services.
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
                </Stack>
            </Container>
        </Box>
    );
};

export default Hero;
