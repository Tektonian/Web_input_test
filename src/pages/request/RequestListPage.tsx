import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Box,
    Divider,
    CircularProgress,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { RequestCard } from "web_component";
import { useNavigate } from "react-router-dom";
import { APIType } from "api_spec/types";

const useRequestList = () => {
    const { mutate, data, isSuccess } = useMutation({
        mutationFn: async (student_id: number) => {
            const res = await fetch("/api/recommend/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ student_id }),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch requests");
            }

            const json = await res.json();
            console.log("json:", json);
            return json.hits;
        },
    });

    const fetchRequestList = (student_id: number) => {
        mutate(student_id);
    };

    return { fetchRequestList, data, isSuccess };
};

const RequestListPage: React.FC = () => {
    const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
    const { fetchRequestList, data, isSuccess } = useRequestList();
    const navigate = useNavigate();

    useEffect(() => {
        const student_id = 1457;
        fetchRequestList(student_id);
    }, []);

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
                maxWidth: "1080px",
                padding: "16px",
                overflowX: "hidden",
                overflowY: { xs: "scroll", md: "hidden" },
                width: "100%",
                minHeight: "100vh",
                boxSizing: "border-box",
                margin: "auto",
            }}
        >
            {!isSuccess ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            ) : isSuccess ? (
                <Box display="flex" flexDirection="column" gap={2} width="100%">
                    {data.map(
                        (
                            request: APIType.RequestType.RequestCard,
                            idx: number,
                        ) => (
                            <Box flex={1}>
                                <RequestCard
                                    title={request.title}
                                    reward_price={request.reward_price}
                                    currency={request.currency}
                                    address={request.address ?? ""}
                                    start_date={request.start_date}
                                    logo_image={request.logo_image}
                                    onClick={() =>
                                        navigate(
                                            `/request/${request.request_id}`,
                                        )
                                    }
                                    renderLogo={true}
                                    request_status={1}
                                />
                            </Box>
                        ),
                    )}
                </Box>
            ) : (
                <Typography color="error" variant="body1">
                    데이터를 불러올 수 없습니다.
                </Typography>
            )}
        </Container>
    );
};

export default RequestListPage;
