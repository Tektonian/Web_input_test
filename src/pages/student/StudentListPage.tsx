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
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { StudentCard } from "web_component";

const useStudentList = () => {
    const { data, mutate, isSuccess } = useMutation({
        mutationFn: async (request_id: number) => {
            const res = await fetch("/api/recommend/students", {
                method: "post",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ request_id: request_id }),
            });
            const json = await res.json();
            return json.hits; // Assume `hits` contains the student list
        },
    });

    const onLoading = (request_id: number) => {
        mutate(request_id);
    };

    return { onLoading, data, isSuccess };
};

const StudentListPage = () => {
    const { request_id } = useParams<{ request_id: string }>();
    const { onLoading, data, isSuccess } = useStudentList();
    const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (request_id) {
            onLoading(Number(request_id));
        }
    }, [request_id]);

    const handleBookmarkToggle = (id: number, isBookmarked: boolean) => {
        setBookmarkedIds((prev) => {
            if (isBookmarked) {
                return [...prev, id];
            } else {
                return prev.filter((bookmarkedId) => bookmarkedId !== id);
            }
        });
    };

    const sendAlarm = async () => {
        if (bookmarkedIds.length === 0) {
            return;
        }

        try {
            const response = await fetch("/api/send-alarm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ selectedStudentIds: bookmarkedIds }),
            });

            if (!response.ok) {
                throw new Error("Failed to send alarm");
            }
        } catch (error) {
            console.error("Error sending alarm:", error);
        }
    };

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
                        <Separator my="3" size="4" />

                        <Text as="div" size="6" weight="bold">
                            학생 리스트
                        </Text>
                        <Separator my="3" size="4" />
                        <Grid
                            columns={{
                                initial: "1",
                                md: "2",
                            }}
                            gap="2"
                            rows="auto"
                            width="auto"
                        >
                            {isSuccess === true ? (
                                data.map((card: any, idx: number) => (
                                    <Flex
                                        key={idx}
                                        justify="center"
                                        align="center"
                                        width="100%"
                                        height="100%"
                                    >
                                        <StudentCard
                                            student_id={card.student_id}
                                            name={card.name_glb}
                                            nationality={card.nationality}
                                            school={card.school_name}
                                            major={card.faculty}
                                            imageUrl=""
                                            link={`http://localhost:3000/student/${card.student_id}`}
                                            languageWithLevel={[
                                                {
                                                    language: "jp",
                                                    level: 2,
                                                },
                                            ]}
                                            isBookmarked={bookmarkedIds.includes(
                                                card.student_id,
                                            )}
                                            onBookmarkClick={(newState) =>
                                                handleBookmarkToggle(
                                                    card.student_id,
                                                    newState,
                                                )
                                            }
                                        />
                                    </Flex>
                                ))
                            ) : (
                                <>로딩 실패</>
                            )}
                        </Grid>
                        <Flex justify="center" mt="4">
                            <Button
                                variant="solid"
                                color="blue"
                                onClick={sendAlarm}
                            >
                                Submit
                            </Button>
                        </Flex>
                    </Container>
                </Flex>
            </Box>
        </Theme>
    );
};

export default StudentListPage;
