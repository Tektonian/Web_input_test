import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StudentProfile } from "web_component";
import { ReviewOfStudent } from "web_component";
import { Theme, Grid, Box, Flex, Text, Separator } from "@radix-ui/themes";

const PageStudentProfile: React.FC = () => {
    const [studentProfile, setStudentProfile] = useState<React.ComponentProps<
        typeof StudentProfile
    > | null>(null);
    const [reviewOfStudent, setReviewOfStudent] = useState<
        React.ComponentProps<typeof ReviewOfStudent>[] | null
    >(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { student_id } = useParams();

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            setError(null);

            try {
                const profileResponse = await fetch(
                    `http://localhost:8080/api/students/${student_id}`,
                    {
                        method: "GET",
                        credentials: "include", // 추가: 인증 정보를 포함
                    },
                );

                if (!profileResponse.ok) {
                    throw new Error("Failed to fetch student profile");
                }

                const studentProfileData = await profileResponse.json();

                const studentReviews = studentProfileData.review.map(
                    (review: any) => {
                        const request_card = {
                            title: review.title,
                            subtitle: review.subtitle,
                            reward_price: review.reward_price,
                            currency: review.currency,
                            address: review.address,
                            start_date: new Date(review.start_date),
                            logo_image: review.logo_image,
                            link: `/request/${review.request_id}`,
                        };
                        return {
                            request_card,
                            was_late: review.was_late,
                            was_proactive: review.was_proactive,
                            was_diligent: review.was_diligent,
                            commu_ability: review.commu_ability,
                            lang_fluent: review.lang_fluent,
                            goal_fulfillment: review.goal_fulfillment,
                            want_cowork: review.want_cowork,
                        };
                    },
                );

                setStudentProfile(studentProfileData.profile || null); // Profile 데이터가 없을 경우 null 처리
                setReviewOfStudent(studentReviews || []); // Reviews 데이터가 없을 경우 빈 배열 처리
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

        fetchStudentData(); // eslint-disable-line
    }, []);

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

    if (!studentProfile) {
        return (
            <Flex justify="center" align="center" style={{ height: "100vh" }}>
                <Text size="6" color="red" weight="bold">
                    Student profile not found.
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
                    {/* Student Profile Section */}
                    <StudentProfile {...studentProfile} />

                    {/* Reviews Section */}
                    {reviewOfStudent && reviewOfStudent.length > 0 ? (
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
                                    {reviewOfStudent.map((review, index) => (
                                        <Flex
                                            key={index}
                                            justify="center"
                                            align="center"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        >
                                            <ReviewOfStudent {...review} />
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

export default PageStudentProfile;
