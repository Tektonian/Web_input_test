import React, { useState } from "react";
import {
    Box,
    Container,
    Tab,
    Tabs,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import { CorpIndexCard } from "web_component";

import RequestListContainer from "./container/RequestListContainer";
import CorporationReviewContainer from "./container/CorporationReviewContainer";
import CorporationProfileContainer from "./container/CorpProfileContainer";
import { useNavigate } from "react-router-dom";

const CorpMypage = () => {
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const sections = ["0", "1", "2", "3", "4"];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "24px",
                maxWidth: "1080px",
                margin: "auto",
                padding: "16px",
                minHeight: "100vh",
            }}
            id={sections[0]}
        >
            <Container
                sx={{
                    width: { xs: "100%", md: "712px" },
                    padding: "0 !important",
                }}
            >
                <CorporationProfileContainer />

                <Box sx={{ marginTop: "24px" }}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        centered
                        variant="fullWidth"
                    >
                        <Tab label="의뢰" />
                        <Tab label="리뷰" />
                    </Tabs>
                </Box>

                {tabIndex === 0 && <RequestListContainer />}

                {tabIndex === 1 && <CorporationReviewContainer />}
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
                <CorpIndexCard />
                <Card
                    sx={{
                        borderRadius: "16px",
                        backgroundColor: "#ff7961",
                    }}
                    onClick={() => navigate(`/requestinput`)}
                >
                    <CardContent
                        sx={{ textAlign: "center", padding: "8px !important" }}
                    >
                        <Typography>의뢰하기</Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default CorpMypage;
