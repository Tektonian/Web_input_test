import React, { useEffect, useState } from "react";
import {
    Theme,
    Container,
    Separator,
    Text,
    Box,
    Flex,
    Grid,
    Button,
} from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import { RequestCard } from "web_component";

export interface RequestCardProps {
    request_id: number;
    title: string;
    subtitle: string;
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

const PageRequestList: React.FC = () => {
    const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
    const { fetchRequestList, data, isSuccess } = useRequestList();

    useEffect(() => {
        const student_id = 1457;
        fetchRequestList(student_id);
    }, []);

    return (
        <Theme>
            <Box width="100%" height="100%" minWidth="300px">
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    gap="3"
                >
                    <Container>
                        <Text as="div" size="6" weight="bold">
                            요청 리스트
                        </Text>
                        <Separator my="3" size="4" />

                        <Grid
                            columns={{
                                initial: "1",
                                md: "2",
                            }}
                            gap="4"
                            rows="auto"
                            width="auto"
                        >
                            {isSuccess ? (
                                data.map(
                                    (
                                        request: RequestCardProps,
                                        idx: number,
                                    ) => (
                                        <Flex
                                            key={idx}
                                            justify="center"
                                            align="center"
                                            width="100%"
                                            height="100%"
                                        >
                                            <RequestCard
                                                title={request.title}
                                                subtitle={request.subtitle}
                                                reward_price={
                                                    request.reward_price
                                                }
                                                currency={request.currency}
                                                address={request.address}
                                                start_date={
                                                    new Date(request.start_date)
                                                }
                                                logo_image={request.logo_image}
                                                link={`/request/${request.request_id}`}
                                            />
                                        </Flex>
                                    ),
                                )
                            ) : (
                                <Text>데이터를 불러올 수 없습니다.</Text>
                            )}
                        </Grid>
                    </Container>
                </Flex>
            </Box>
        </Theme>
    );
};

export default PageRequestList;
