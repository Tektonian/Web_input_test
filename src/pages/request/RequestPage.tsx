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
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import type { APIType } from "api_spec";
import RequestContentContainer from "./container/RequestContentContainer";
import ConsumerContainer from "./container/ConsumerContainer";
import OtherRequestContainer from "./container/OtherRequestContainer";

const RequestPage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };
    const [data, setData] = useState<APIType.RequestType.ResGetRequest>();

    const { request_id: request_id } = useParams();

    const handleApply = async () => {
        try {
            await fetch("http://localhost:8080/api/message/chatRoom", {
                method: "POST",
                body: JSON.stringify({ request_id: request_id }),
                headers: {
                    "content-Type": "Application/json",
                },
                credentials: "include",
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_SERVER_BASE_URL}/api/requests/${request_id}`,
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

    const { mutate } = useMutation({
        mutationFn: async () => {
            const res = await fetch(
                `${process.env.REACT_APP_SERVER_BASE_URL}/api/message/chatroom`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ request_id: request_id }),
                },
            );
        },
    });

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
                    padding: "0 !important",
                }}
            >
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
                        {tabIndex === 1 && data && (
                            <>
                                <ConsumerContainer corp_id={data.corp_id} />
                                <OtherRequestContainer corp_id={data.corp_id} />
                            </>
                        )}
                    </CardContent>
                </Card>
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
                {data && <RequestSideCard request={data} />}
                <Card
                    onClick={(e) => mutate()}
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
