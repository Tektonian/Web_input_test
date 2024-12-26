import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Box,
    Grid2 as Grid,
    Divider,
    CircularProgress,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { RequestCard } from "web_component";

export interface RequestCardProps {
    request_id: number;
    title: string;
    reward_price: number;
    currency: "USD" | "KRW" | "JPY" | "";
    address: string;
    start_date: Date;
    logo_image?: string;
    link: string;
}

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

    useEffect(() => {
        const student_id = 1457;
        fetchRequestList(student_id);
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
        >
            <Container maxWidth="md">
                <Box mb={3}>
                    <Typography
                        variant="h4"
                        component="div"
                        fontWeight="bold"
                        gutterBottom
                    >
                        요청 리스트
                    </Typography>
                    <Divider />
                </Box>

                {isSuccess ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                ) : isSuccess ? (
                    <Grid container spacing={2}>
                        {data.map((request: RequestCardProps, idx: number) => (
                            <Grid size={12} key={idx}>
                                <RequestCard
                                    title={request.title}
                                    reward_price={request.reward_price}
                                    currency={request.currency}
                                    address={request.address}
                                    start_date={new Date(request.start_date)}
                                    logo_image={request.logo_image}
                                    onClick={() => {}}
                                    renderLogo={true}
                                    request_status={1}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography color="error" variant="body1">
                        데이터를 불러올 수 없습니다.
                    </Typography>
                )}
            </Container>
        </Box>
    );
};

export default RequestListPage;
