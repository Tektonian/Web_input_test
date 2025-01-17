import React, { useState } from "react";
import {
    Box,
    Container,
    Tab,
    Tabs,
    Typography,
    Card,
    CardContent,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { CorpIndexCard } from "@mesh/web_component";

import RequestListContainer from "../request/container/RequestListContainer";
import CorporationReviewContainer from "./container/CorporationReviewContainer";
import CorporationProfileContainer from "./container/CorpProfileContainer";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CorpMypage = () => {
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);
    const { corp_id: corp_id } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
                alignItems: "center",
                gap: "24px",
                maxWidth: "1080px",
                padding: "16px",
                overflowX: "hidden",
                overflowY: { xs: "scroll", md: "hidden" },
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                margin: "auto",
            }}
        >
            <Container
                sx={{
                    width: { xs: "100%", md: "712px" },
                    height: "100%",
                    padding: "0 !important",
                }}
            >
                <CorporationProfileContainer corp_id={Number(corp_id)} />

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

                {tabIndex === 0 && (
                    <RequestListContainer corp_id={Number(corp_id)} />
                )}

                {tabIndex === 1 && (
                    <CorporationReviewContainer corp_id={Number(corp_id)} />
                )}
            </Container>

            <Container
                sx={{
                    width: { xs: "100%", md: "344px" },
                    height: "100%",
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
                {!isMobile && <CorpIndexCard />}
                <Card
                    sx={{
                        borderRadius: "16px",
                        backgroundColor: "#ff7961",
                    }}
                    onClick={() => navigate(`/request/write`)}
                >
                    <CardContent
                        sx={{
                            textAlign: "center",
                            padding: "8px !important",
                        }}
                    >
                        <Typography>의뢰하기</Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default CorpMypage;
