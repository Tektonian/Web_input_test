import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { RequestDataCard, RequestSideCard } from "web_component";
import { useParams } from "react-router-dom";
import { APIType } from "api_spec";

const RequestPage = () => {
    const [
        reqData,
        setReqData,
    ] = useState<APIType.RequestType.ResGetRequest | null>(null);

    const request_id = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`api/requests/${request_id}`, {
                    method: "GET",
                });
                const data: APIType.RequestType.ResGetRequest = await response.json();

                console.log(data);

                setReqData(data);
            } catch (error) {
                console.error("Error fetching request data:", error);
            }
        };
        fetchData(); //eslint-disable-line
    }, []);

    const sections = ["0", "1", "2", "3", "4"];

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
            }}
            id={sections[0]}
        >
            <Container sx={{ width: "712px", padding: "0 !important" }}>
                {reqData && (
                    <RequestDataCard
                        requestData={reqData.request}
                        corpCard={reqData.corp_card}
                        otherRequests={reqData.other_requests.map(
                            (request) => ({
                                ...request,
                                renderLogo: false,
                                onClick: () => alert("request card clicked"),
                            }),
                        )}
                    />
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
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                }}
            >
                {reqData && <RequestSideCard request={reqData?.request} />}
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
