import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Badge,
    Menu,
    MenuItem,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";

import UnreadCount from "./Header/UnreadCount";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "../hooks/Session";
import { Container } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";

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

const StudentProfile = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const navigate = useNavigate();

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const mobileMenuId = "primary-search-account-menu-mobile";
    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>내 페이지</MenuItem>
            <MenuItem onClick={handleMenuClose}>추천 요청 보기</MenuItem>
        </Menu>
    );
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                >
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>채팅</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>알림</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>프로필</p>
            </MenuItem>
        </Menu>
    );
    return (
        <>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <UnreadCount onClick={() => navigate("/chat")} />

                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={0} color="error">
                        <NotificationsIcon color="action" />
                    </Badge>
                </IconButton>
                <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                >
                    <AccountCircle color="action" />
                </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                >
                    <MoreIcon color="action" />
                </IconButton>
            </Box>
            {renderMobileMenu}
            {renderMenu}
        </>
    );
};

const OrgnProfile = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const navigate = useNavigate();

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const mobileMenuId = "primary-search-account-menu-mobile";
    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>내 페이지</MenuItem>
            <MenuItem onClick={handleMenuClose}>요청 살펴보기</MenuItem>
            <MenuItem onClick={handleMenuClose}>추천 학생 보기</MenuItem>
        </Menu>
    );
    return (
        <>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <UnreadCount onClick={() => navigate("/chat")} />

                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={0} color="error">
                        <NotificationsIcon color="action" />
                    </Badge>
                </IconButton>
                <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                >
                    <AccountCircle color="action" />
                </IconButton>
            </Box>
            {renderMenu}
        </>
    );
};

const Header = () => {
    const { data: session, status } = useSession({ required: false });
    const roles = session?.user?.roles || [];
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    /*
    if (location.pathname === "/chat" || isMobile) {
        return null;
    }
    */

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
                        src="image/tektonian_logo.png"
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
                        <Button
                            onClick={() => navigate("/request/recommend/list")}
                        >
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
                                <StudentProfile />
                            ) : roles.includes("corp") ||
                              roles.includes("orgn") ? (
                                <OrgnProfile />
                            ) : null
                        ) : (
                            <>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                    onClick={() =>
                                        navigate(
                                            "http://localhost:8080/api/auth/signin",
                                        )
                                    }
                                >
                                    회원가입
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
