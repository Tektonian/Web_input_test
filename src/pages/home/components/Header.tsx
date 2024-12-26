import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import UnreadCount from "../../../components/UnreadCount";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "../../../hooks/Session";
import tektonianLogo from "./tektonian_logo.png";
import { Container } from "@radix-ui/themes";

const StyledToolbar = styled(Toolbar)(({ theme }: any) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    borderRadius: 0,
    backdropFilter: "blur(24px)",
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    padding: "8px 12px",
}));

const Header = () => {
    const [open, setOpen] = useState(false);
    const { data: session, status } = useSession();
    const roles = session?.user?.roles || [];
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === "/chat") {
        return null;
    }

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const renderStudentHeader = () => (
        <>
            <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={() => navigate("/mypage")}
            >
                Mypage
            </Button>
            <UnreadCount onClick={() => navigate("/chat")} />
        </>
    );

    const renderCorpOrOrgnHeader = () => (
        <>
            <Button
                color="secondary"
                variant="contained"
                size="small"
                onClick={() => navigate("/requestinput")}
            >
                Post Request
            </Button>
            <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={() => navigate("/mypage")}
            >
                Mypage
            </Button>
            <UnreadCount onClick={() => navigate("/chat")} />
        </>
    );

    return (
        <AppBar
            position="sticky"
            enableColorOnDark
            sx={{
                boxShadow: "none",
                bgcolor: "background.default",
                backgroundImage: "none",
                width: "100%",
            }}
        >
            <Container>
                <StyledToolbar>
                    {/* Logo */}
                    <Box
                        component="img"
                        src={tektonianLogo}
                        alt="Tektonian Logo"
                        sx={{
                            height: "40px",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/home")}
                    />

                    {/* Centered Navigation */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: 1,
                            px: 2,
                            maxWidth: "lg",
                            mx: "auto",
                            width: "100%",
                        }}
                    >
                        <Button onClick={() => navigate("/home")}>Home</Button>
                        <Button onClick={() => navigate("/request-list")}>
                            Request
                        </Button>
                    </Box>

                    {/* Right Aligned Content */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            justifyContent: "flex-end",
                            flexGrow: 1,
                        }}
                    >
                        {status === "authenticated" ? (
                            roles.includes("student") ? (
                                renderStudentHeader()
                            ) : roles.includes("corp") ||
                              roles.includes("orgn") ? (
                                renderCorpOrOrgnHeader()
                            ) : null
                        ) : (
                            <>
                                <Button
                                    color="primary"
                                    variant="text"
                                    size="small"
                                    onClick={() => navigate("/login")}
                                >
                                    Sign in
                                </Button>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                    onClick={() => navigate("/signup")}
                                >
                                    Sign up
                                </Button>
                            </>
                        )}
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
