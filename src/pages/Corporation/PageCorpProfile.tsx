import React, { useEffect, useState } from "react";
import { CorpProfile } from "web_component";
import { ReviewOfCorp } from "web_component";
import { Theme, Grid, Box, Flex, Text, Separator } from "@radix-ui/themes";

export interface PageCorpProfileProps {
    consumerId: number; // Consumer ID를 부모 컴포넌트로부터 전달받음
}

const PageCorpProfile: React.FC<PageCorpProfileProps> = ({ consumerId }) => {
    const [corpProfile, setCorpProfile] = useState<React.ComponentProps<
        typeof CorpProfile
    > | null>(null);
    const [reviewOfCorp, setReviewOfCorp] = useState<
        React.ComponentProps<typeof ReviewOfCorp>[] | null
    >(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCorpData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [profileResponse, reviewsResponse] = await Promise.all([
                    fetch(
                        `http://localhost:8080/api/corporations/${consumerId}`,
                    ),
                    fetch(
                        `http://localhost:8080/api/corporation-reviews/${consumerId}`,
                    ),
                ]);

                if (!profileResponse.ok) {
                    throw new Error("Failed to fetch corporation profile");
                }
                if (!reviewsResponse.ok) {
                    throw new Error("Failed to fetch corporation reviews");
                }

                const corpProfileData = await profileResponse.json();
                const reviewOfCorpData = await reviewsResponse.json();

                setCorpProfile(corpProfileData || null); // Profile 데이터가 없을 경우 null 처리
                setReviewOfCorp(reviewOfCorpData || []); // Reviews 데이터가 없을 경우 빈 배열 처리
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
    }, [consumerId]);

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

    if (!corpProfile) {
        return (
            <Flex justify="center" align="center" style={{ height: "100vh" }}>
                <Text size="6" color="red" weight="bold">
                    Corporation profile not found.
                </Text>
            </Flex>
        );
    }

    return (
        <Theme>
            <Flex direction="column" align="center" justify="center">
                <Box
                    width={{ xs: "520px", sm: "768px", md: "1024px" }}
                    minWidth="300px"
                >
                    {/* Corporation Profile Section */}
                    <CorpProfile {...corpProfile} />

                    {/* Reviews Section */}
                    {reviewOfCorp && reviewOfCorp.length > 0 ? (
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
                                    {reviewOfCorp.map((review, index) => (
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
