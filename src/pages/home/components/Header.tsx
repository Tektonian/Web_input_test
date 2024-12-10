import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UnreadCount from "../../../components/UnreadCount";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation 추가
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
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === "/chat") {
        return null;
    }

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

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
                {" "}
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
                        <UnreadCount onClick={() => navigate("/chat")} />
                        {status === "authenticated" ? (
                            <Button
                                color="primary"
                                variant="contained"
                                size="small"
                            >
                                Mypage
                            </Button>
                        ) : (
                            <>
                                <Button
                                    color="primary"
                                    variant="text"
                                    size="small"
                                >
                                    Sign in
                                </Button>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                >
                                    Sign up
                                </Button>
                            </>
                        )}
                    </Box>

                    {/* Mobile Menu */}
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            aria-label="Menu button"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                            PaperProps={{
                                sx: {
                                    top: "0",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    p: 2,
                                    backgroundColor: "background.default",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>
                                <MenuItem onClick={() => navigate("/home")}>
                                    Home
                                </MenuItem>
                                <MenuItem
                                    onClick={() => navigate("/request-list")}
                                >
                                    Request
                                </MenuItem>
                                <MenuItem onClick={() => navigate("/chat")}>
                                    Chat
                                </MenuItem>
                                <Box sx={{ mt: 3 }}>
                                    {status === "authenticated" ? (
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            fullWidth
                                        >
                                            Mypage
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                fullWidth
                                                sx={{ mb: 1 }}
                                            >
                                                Sign up
                                            </Button>
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                fullWidth
                                            >
                                                Sign in
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
