import React, { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { IndexCard, RequestCard, CorpProfileCard } from "web_component";
import { APIType } from "api_spec";
import { useParams } from "react-router-dom";

const CorpProfilePage = () => {
    const [
        corpData,
        setCorpData,
    ] = useState<APIType.CorporationType.ResGetCorpProfile | null>(null);
    const corp_id = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/corporations/${corp_id}`, {
                    method: "GET",
                });

                const data: APIType.CorporationType.ResGetCorpProfile = await response.json();

                console.log(data);

                setCorpData(data);
            } catch (error) {
                console.error("Error fetching corporation data", error);
            }
        };
    }, []);

    const ongoingRequests = corpData?.requests.filter(
        (req) => req.request_status === 3,
    );
    const openRequests = corpData?.requests.filter(
        (req) => req.request_status === 0,
    );
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

                <Box sx={{ marginTop: "24px" }} id={sections[1]}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", marginBottom: "16px" }}
                    >
                        진행 중인 요청
                    </Typography>
                    {ongoingRequests?.map((request, index) => (
                        <Box key={index} sx={{ marginTop: "16px" }}>
                            <RequestCard
                                {...request}
                                renderLogo={false}
                                onClick={() => alert("ongoing request clicked")}
                            />
                        </Box>
                    ))}
                </Box>

                <Box sx={{ marginTop: "24px" }} id={sections[4]}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", marginBottom: "16px" }}
                    >
                        신청 요청
                    </Typography>
                    {openRequests?.map((request, index) => (
                        <Box key={index} sx={{ marginTop: "16px" }}>
                            <RequestCard
                                {...request}
                                renderLogo={false}
                                onClick={() => alert("open request clicked")}
                            />
                        </Box>
                    ))}
                </Box>

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
                                renderLogo={false}
                                onClick={() => alert("past request clicked")}
                            />
                        </Box>
                    ))}
                </Box>
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
                <IndexCard roles="corp" sections={sections} />
            </Container>
        </Box>
    );
};

export default CorpProfilePage;
