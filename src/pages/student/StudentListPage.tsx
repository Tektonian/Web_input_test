import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Box,
    Grid2 as Grid,
    Button,
    Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { StudentCard } from "web_component";

const StudentListPage = () => {
    const { request_id } = useParams<{ request_id: string }>();
    const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
    const navigate = useNavigate();

    const { data, isSuccess } = useQuery({
        queryKey: [request_id],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.REACT_APP_SERVER_BASE_URL}/api/recommend/students`,
                {
                    method: "post",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ request_id: request_id }),
                },
            );
            return res.json();
        },
    });

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
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_BASE_URL}/api/send-alarm`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ selectedStudentIds: bookmarkedIds }),
                },
            );

            if (!response.ok) {
                throw new Error("Failed to send alarm");
            }
        } catch (error) {
            console.error("Error sending alarm:", error);
        }
    };

    return (
        <Box width="100%" minWidth="300px" py={4}>
            <Container maxWidth="lg">
                <Divider sx={{ my: 3 }} />

                <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    gutterBottom
                >
                    추천 학생 리스트
                </Typography>
                <Divider sx={{ my: 3 }} />

                {isSuccess ? (
                    <Grid container spacing={2}>
                        {data &&
                            data.map((card: any, idx: number) => (
                                <Grid size={4} key={idx}>
                                    <StudentCard
                                        key={card.student_id}
                                        student_id={card.student_id}
                                        name={card.name_glb.KR}
                                        nationality={"KR" /*card.nationality*/}
                                        school={card.school_name}
                                        major={card.faculty}
                                        imageUrl=""
                                        languageWithLevel={[
                                            {
                                                language: "jp",
                                                level: 2,
                                            },
                                        ]}
                                        isBookmarked={bookmarkedIds.includes(
                                            card.student_id,
                                        )}
                                        onBookmarkClick={(newState) => {
                                            handleBookmarkToggle(
                                                card.student_id,
                                                newState,
                                            );
                                            navigate(
                                                `/student/${card.student_id}`,
                                            );
                                        }}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                ) : (
                    <Box display="flex" justifyContent="center" py={4}>
                        <Typography variant="body1" color="error">
                            로딩 실패
                        </Typography>
                    </Box>
                )}

                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendAlarm}
                    >
                        Submit
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default StudentListPage;
