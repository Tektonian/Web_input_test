import React, { useState } from "react";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { StudentIndexCard } from "web_component";
import MyPageRequestList from "./container/MyPageRequestList";
import MyProfile from "./container/MyProfile";
import { useParams } from "react-router-dom";

const MyPage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const { student_id: student_id } = useParams();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const sections = ["0", "1", "2", "3", "4"];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: {
                    xs: "column",
                    md: "row",
                },
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "24px",
                maxWidth: "80vw",
                margin: "auto",
                padding: "16px",
                minHeight: "100vh",
            }}
            id={sections[0]}
        >
            <Container
                sx={{
                    width: { xs: "100%", md: "300px" },
                    padding: "0 !important",
                }}
            >
                <MyProfile />
            </Container>
            <Container
                sx={{
                    width: { xs: "100%", md: "712px" },
                    padding: "0 !important",
                }}
            >
                <MyPageRequestList />
            </Container>

            <Container
                sx={{
                    width: { xs: "100%", md: "344px" },
                    padding: "0 !important",
                    position: { xs: "relative", md: "sticky" },
                    top: { md: "50%" },
                    transform: { md: "translateY(-50%)" },
                    order: { xs: -1, md: 1 },
                }}
            >
                <StudentIndexCard sections={sections} />
            </Container>
        </Box>
    );
};

export default MyPage;
