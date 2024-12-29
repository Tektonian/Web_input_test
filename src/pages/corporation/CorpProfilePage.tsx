import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Tab,
    Tabs,
    Typography,
    Grid2 as Grid,
} from "@mui/material";
import {
    CorpIndexCard,
    RequestCard,
    CorpProfileCard,
    ReviewOfCorpCard,
} from "web_component";
import { APIType } from "api_spec";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CorpProfilePage: React.FC = () => {
    const [corpData, setCorpData] =
        useState<APIType.CorporationType.ResGetCorpProfile | null>(null);
    const { corp_id } = useParams();
    const navigate = useNavigate();

    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/corporations/${corp_id}`,
                    {
                        method: "GET",
                    },
                );

                const data: APIType.CorporationType.ResGetCorpProfile =
                    await response.json();

                console.log("data:", data);

                setCorpData(data);
            } catch (error) {
                console.error("Error fetching corporation data", error);
            }
        };
        fetchData(); //eslint-disable-line
    }, []);

    const pastRequests = corpData?.requests.filter(
        (req) => req.request_status === 4 || req.request_status === 5,
    );

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
                {corpData && <CorpProfileCard {...corpData?.corp} />}

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
                    <Box sx={{ marginTop: "24px" }}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", marginBottom: "16px" }}
                        >
                            과거 요청
                        </Typography>
                        {pastRequests?.map((request, index) => (
                            <Box key={index} sx={{ marginTop: "16px" }}>
                                <RequestCard
                                    {...request}
                                    address={request.address ?? ""}
                                    request_status={request.request_status ?? 4}
                                    renderLogo={false}
                                    onClick={() =>
                                        navigate(
                                            `/request/${request.request_id}`,
                                        )
                                    }
                                />
                            </Box>
                        ))}
                    </Box>
                )}

                {tabIndex === 1 && (
                    <Box sx={{ marginTop: "16px" }}>
                        <Grid container spacing={3}>
                            {corpData?.reviews.map((review, index) => (
                                <Grid size={6} key={index}>
                                    <ReviewOfCorpCard {...review} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>

            <Container
                sx={{
                    width: { xs: "100%", md: "344px" }, // 작은 화면에서는 100% 폭
                    padding: "0 !important",
                    position: { xs: "relative", md: "sticky" }, // 작은 화면에서는 위치 고정 해제
                    top: { md: "50%" }, // 중간 위치 (데스크톱만)
                    transform: { md: "translateY(-50%)" }, // 중간 위치 조정 (데스크톱만)
                    order: { xs: -1, md: 1 }, // 모바일에서 위로 이동
                }}
            >
                <CorpIndexCard />
            </Container>
        </Box>
    );
};

export default CorpProfilePage;
