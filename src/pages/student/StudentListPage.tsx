import React, { useEffect, useState } from "react";
import PageStudentProfile from "./PageStudentProfile";
import {
    Theme,
    Container,
    Separator,
    Avatar,
    Text,
    Box,
    Flex,
    Grid,
    Card,
    Button,
} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
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
            // @ts-ignore
            const json = await res.json();
            console.log(json.hits);
            // @ts-ignore
            return json.hits;
        },
    });

    const onLoading = () => {
        mutate(2);
    };

    return { onLoading, data, isSuccess };
};

const StudentListPage = () => {
    const { onLoading, data, isSuccess } = useStudentList();
    const navigate = useNavigate();

    useEffect(() => {
        onLoading();
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
                                // @ts-ignore
                                data.map((card: any, idx: number) => (
                                    <Flex
                                        key={idx}
                                        justify="center"
                                        align="center"
                                        width="100%"
                                        height="100%"
                                    >
                                        <StudentCard
                                            name={card.name_glb}
                                            nationality={card.nationality}
                                            school={card.school_name}
                                            major={card.faculty}
                                            imageUrl=""
                                            languageWithLevel={[
                                                {
                                                    language: "jp",
                                                    level: 2,
                                                },
                                            ]}
                                            onBookmarkClick={() => {
                                                console.log(card);
                                                navigate(
                                                    `/student/${card.student_id}`,
                                                );
                                            }}
                                        />
                                    </Flex>
                                ))
                            ) : (
                                <>로딩 실패</>
                            )}
                        </Grid>
                    </Container>
                </Flex>
            </Box>
        </Theme>
    );
};

export default StudentListPage;
