import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Tabs,
    Tab,
} from "@mui/material";
import { RequestSideCard } from "web_component";
import { useParams } from "react-router-dom";
import { APIType } from "api_spec";
import { useNavigate } from "react-router-dom";
import RequestContentContainer from "./container/RequestContentContainer";
import ConsumerContainer from "./container/ConsumerContainer";

const RequestPage = () => {
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };
    const [data, setData] = useState<APIType.RequestType.ResGetRequest>();

    const { request_id: request_id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/requests/${request_id}`,
                    {
                        method: "GET",
                    },
                );
                const data: APIType.RequestType.ResGetRequest =
                    await response.json();

                console.log("data:", data);

                setData(data);
            } catch (error) {
                console.error("Error fetching request data:", error);
            }
        };
        fetchData(); //eslint-disable-line
    }, [request_id]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "24px",
                maxWidth: "1080px",
                margin: "auto",
                padding: "16px",
                minHeight: "100vh",
            }}
        >
            <Container sx={{ width: "712px", padding: "0 !important" }}>
                <Card
                    sx={{
                        maxWidth: 1080,
                        margin: "auto",
                        borderRadius: "16px",
                        fontFamily: "Noto Sans KR",
                        backgroundColor: "#ffffff",
                        border: "1px solid #d3d3d3",
                        boxShadow: "none",
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                fontWeight: "bold",
                                fontFamily: "Noto Sans KR",
                                marginBottom: 2,
                            }}
                        >
                            {data?.title}
                        </Typography>
                        <Box
                            display="flex"
                            alignItems="center"
                            marginBottom={3}
                        >
                            {data?.logo_image && (
                                <Box
                                    component="img"
                                    src={data.logo_image}
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        marginRight: 2,
                                        borderRadius: "4px",
                                    }}
                                />
                            )}
                        </Box>
                        <Tabs
                            value={tabIndex}
                            onChange={handleTabChange}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="fullWidth"
                        >
                            <Tab label="상세 정보" />
                            <Tab label="기업 정보" />
                        </Tabs>
                        {tabIndex === 0 && data && (
                            <RequestContentContainer {...data} />
                        )}
                        {tabIndex === 1 && data && <ConsumerContainer />}
                    </CardContent>
                </Card>
            </Container>

            <Container
                sx={{
                    width: { xs: "100%", md: "344px" }, // 작은 화면에서는 100% 폭
                    padding: "0 !important",
                    position: { xs: "relative", md: "sticky" }, // 작은 화면에서는 위치 고정 해제
                    top: { md: "50%" }, // 중간 위치 (데스크톱만)
                    transform: { md: "translateY(-50%)" }, // 중간 위치 조정 (데스크톱만)
                    order: { xs: -1, md: 1 }, // 모바일에서 위로 이동
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                }}
            >
                {data && <RequestSideCard request={data} />}
                <Card
                    sx={{
                        borderRadius: "16px",
                        backgroundColor: "#ff7961",
                    }}
                >
                    <CardContent
                        sx={{ textAlign: "center", padding: "8px !important" }}
                    >
                        <Typography>신청하기</Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default RequestPage;
