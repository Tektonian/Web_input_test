import React, { useEffect, useState } from "react";
import { CorpProfile } from "web_component";
import { ReviewOfCorp } from "web_component";
import { Theme, Grid, Box, Flex, Text, Separator } from "@radix-ui/themes";
import { useParams } from "react-router-dom";

const PageCorpProfile = () => {
    const [corpData, setCorpData] = useState<{
        profile: React.ComponentProps<typeof CorpProfile>;
        reviews: Array<
            React.ComponentProps<typeof ReviewOfCorp> & {
                requestCard: {
                    title: string;
                    subtitle?: string;
                    reward_price: number;
                    currency: string;
                    address: string;
                    start_date: string;
                    end_date: string;
                };
            }
        >;
    } | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { corp_id } = useParams<{ corp_id: string }>();

    useEffect(() => {
        const fetchCorpData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/corporation-reviews/${corp_id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch corporation data");
                }

                const data = await response.json();

                const { requests, reviews, ...profile } = data;

                console.log(reviews);
                console.log(requests);

                const mappedReviews = reviews.map(
                    (review: any, index: number) => {
                        const request = requests[index] || {};
                        return {
                            ...review,
                            request_card: {
                                title: request.title ?? "No Title",
                                subtitle: request.subtitle ?? "No Subtitle",
                                reward_price: request.reward_price ?? 0,
                                currency: request.currency ?? "N/A",
                                address: request.address ?? "No Address",
                                start_date:
                                    new Date(request.start_date) ??
                                    "No Start Date",
                                end_date: request.end_date ?? "No End Date",
                                link: `/request/${request.request_id}`,
                            },
                        };
                    },
                );

                setCorpData({ profile, reviews: mappedReviews });
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unknown error occurred",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCorpData(); //eslint-disable-line
    }, [corp_id]);

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ height: "100vh" }}>
                <Text size="6" weight="bold">
                    Loading...
                </Text>
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex justify="center" align="center" style={{ height: "100vh" }}>
                <Text size="6" color="red" weight="bold">
                    {error}
                </Text>
            </Flex>
        );
    }

    if (!corpData) {
        return (
            <Flex justify="center" align="center" style={{ height: "100vh" }}>
                <Text size="6" color="red" weight="bold">
                    Corporation data not found.
                </Text>
            </Flex>
        );
    }

    const { profile, reviews } = corpData;

    return (
        <Theme>
            <Flex direction="column" align="center" justify="center">
                <Box
                    width={{
                        initial: "300px",
                        xs: "520px",
                        sm: "768px",
                        md: "1024px",
                    }}
                >
                    <CorpProfile {...profile} />

                    {reviews && reviews.length > 0 ? (
                        <>
                            <Separator my="3" size="4" />
                            <Grid gapY="5">
                                <Text as="div" size="6" weight="bold">
                                    Past Activity
                                </Text>
                                <Grid
                                    columns={{ initial: "1", md: "2" }}
                                    gap="3"
                                >
                                    {reviews.map((review, index) => (
                                        <Flex
                                            key={index}
                                            justify="center"
                                            align="center"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        >
                                            <ReviewOfCorp {...review} />
                                        </Flex>
                                    ))}
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <Text as="div" size="4" color="gray" align="center">
                            No reviews available.
                        </Text>
                    )}
                </Box>
            </Flex>
        </Theme>
    );
};

export default PageCorpProfile;
