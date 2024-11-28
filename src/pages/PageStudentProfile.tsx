import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentProfile, {
    StudentProfileProps,
} from "../components/StudentProfile";
import ReviewOfStudent, {
    ReviewOfStudentProps,
} from "../components/ReviewOfStudent";
import { Theme, Grid, Box, Flex, Text, Separator } from "@radix-ui/themes";

const PageStudentProfile: React.FC = () => {
    const [studentProfile, setStudentProfile] =
        useState<StudentProfileProps | null>(null);
    const [reviewOfStudent, setReviewOfStudent] = useState<
        ReviewOfStudentProps[] | null
    >(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { student_id } = useParams();

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [profileResponse, reviewsResponse] = await Promise.all([
                    fetch(`http://localhost:8080/api/students/${student_id}`),
                    fetch(
                        `http://localhost:8080/api/student-reviews/${student_id}`,
                    ),
                ]);

                if (!profileResponse.ok) {
                    throw new Error("Failed to fetch student profile");
                }
                if (!reviewsResponse.ok) {
                    throw new Error("Failed to fetch student reviews");
                }

                const studentProfileData = await profileResponse.json();
                const reviewOfStudentData = await reviewsResponse.json();

                setStudentProfile(studentProfileData || null); // Profile 데이터가 없을 경우 null 처리
                setReviewOfStudent(reviewOfStudentData || []); // Reviews 데이터가 없을 경우 빈 배열 처리
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
