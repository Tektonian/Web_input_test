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
import type { APIType } from "api_spec";

const useRequestList = () => {
    const { mutate, data, isSuccess } = useMutation({
        mutationFn: async (student_id: number) => {
            const res = await fetch(
                `${process.env.REACT_APP_SERVER_BASE_URL}/api/recommend/requests`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ student_id }),
                },
            );

            return res.json();
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
                py: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "1080px",
                width: "100%",
                minHeight: "100%",
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
                                    request_id={request.request_id}
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
