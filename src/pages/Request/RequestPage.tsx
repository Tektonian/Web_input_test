/* eslint-disable */
import React, { useEffect, useState } from "react";
import { RequestProfile } from "web_component";
import { StickyButton } from "web_component";
import { Flex, Box, Separator, Container } from "@radix-ui/themes";

interface RequestProfileProps {
    request_id: number;
    consumer_id: number;
    title: string;
    subtitle: string;
    head_count: number;
    reward_price: number;
    currency: "USD" | "KRW" | "JPY" | "";
    content: string;
    are_needed: string;
    are_required: string;
    request_status: number;
    start_time: string;
    end_time: string;
    address: string;
    address_coordinate: { lat: number; lng: number };
    provide_food: boolean;
    provide_trans_exp: boolean;
    prep_material: string;
    created_at: Date;
    updated_at: Date;
    start_date: Date;
    end_date: Date;
    corp_id: number;
    corp_name: string;
    nationality: string;
    corp_num: number;
}

export interface RequestPageProps {
    request_id: string;
}

const RequestPage: React.FC<RequestPageProps> = ({ request_id }) => {
    const [request, setRequest] = useState<RequestProfileProps | null>(null);
    const [sticky, setSticky] = useState<
        React.ComponentProps<typeof StickyButton>
    >({
        viewerType: 1,
        innerText: "신청하기",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/requests/${request_id}`);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch data: ${response.statusText}`,
                    );
                }

                const data = await response.json();

                setRequest({
                    request_id: data.request_id,
                    consumer_id: data.consumer_id,
                    title: data.title,
                    subtitle: data.subtitle,
                    head_count: data.head_count,
                    reward_price: data.reward_price,
                    currency: data.currency,
                    content: data.content,
                    are_needed: data.are_needed,
                    are_required: data.are_required,
                    request_status: data.request_status,
                    start_time: new Date(data.start_time).toISOString(),
                    end_time: new Date(data.end_time).toISOString(),
                    address: data.address,
                    address_coordinate: data.address_coordinate,
                    provide_food: data.provide_food,
                    provide_trans_exp: data.provide_trans_exp,
                    prep_material: data.prep_material,
                    created_at: new Date(data.created_at),
                    updated_at: new Date(data.updated_at),
                    start_date: new Date(data.start_date),
                    end_date: new Date(data.end_date),
                    corp_id: data.corp_id, // 추가
                    corp_name: data.corp_name, // 추가
                    nationality: data.nationality, // 추가
                    corp_num: data.corp_num, // 추가
                });

                setSticky({
                    viewerType: 1,
                    innerText: "신청하기",
                });
            } catch (error) {
                console.error("Error fetching request data:", error);
                setError(
                    "데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRequestData();
    }, [request_id]);

    if (loading) {
        return (
            <Container
                width={{
                    initial: "300px",
                    xs: "520px",
                    sm: "768px",
                    md: "1024px",
                }}
            >
                <Flex direction="column" align="center" justify="center">
                    <Box width="1024px" mt="5">
                        <h2>Loading...</h2>
                    </Box>
                </Flex>
            </Container>
        );
    }

    if (error) {
        return (
            <Container
                width={{
                    initial: "300px",
                    xs: "520px",
                    sm: "768px",
                    md: "1024px",
                }}
            >
                <Flex direction="column" align="center" justify="center">
                    <Box width="1024px" mt="5">
                        <h2>Error</h2>
                        <p>{error}</p>
                    </Box>
                </Flex>
            </Container>
        );
    }

    if (!request) {
        return (
            <Container
                width={{
                    initial: "300px",
                    xs: "520px",
                    sm: "768px",
                    md: "1024px",
                }}
            >
                <Flex direction="column" align="center" justify="center">
                    <Box width="1024px" mt="5">
                        <h2>No Request Found</h2>
                    </Box>
                </Flex>
            </Container>
        );
    }

    return (
        <Container
            width={{
                initial: "300px",
                xs: "520px",
                sm: "768px",
                md: "1024px",
            }}
        >
            <Flex direction="column" align="center" justify="center">
                <RequestProfile
                    request_id={request.request_id}
                    consumer_id={request.consumer_id}
                    title={request.title}
                    subtitle={request.subtitle}
                    head_count={request.head_count}
                    reward_price={request.reward_price}
                    currency={request.currency}
                    content={request.content}
                    are_needed={request.are_needed}
                    are_required={request.are_required}
                    start_date={request.start_date}
                    end_date={request.end_date}
                    start_time={request.start_time}
                    end_time={request.end_time}
                    address={request.address}
                    address_coordinate={request.address_coordinate}
                    provide_food={request.provide_food}
                    provide_trans_exp={request.provide_trans_exp}
                    prep_material={request.prep_material}
                    created_at={request.created_at}
                    request_status={request.request_status}
                    corp_id={request.corp_id}
                    corp_name={request.corp_name}
                    nationality={request.nationality}
                    corp_num={request.corp_num}
                />
                <Box width="1024px">
                    <Separator my="3" size="4" />
                </Box>
            </Flex>
            <StickyButton {...sticky} />
        </Container>
    );
};

export default RequestPage;
