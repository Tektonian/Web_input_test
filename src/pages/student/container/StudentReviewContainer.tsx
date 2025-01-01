import React, { useState, useEffect } from "react";
import { Box, Grid2 as Grid } from "@mui/material";
import { ReviewOfStudentCard } from "web_component";
import { APIType } from "api_spec";

const StudentReviewContainer = () => {
    const [reviews, setReviews] = useState<
        APIType.StudentReviewType.StudentReviewData[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/student-review`, {
                    method: "GET",
                    credentials: "include",
                });
                const data: APIType.StudentReviewType.StudentReviewData[] =
                    await response.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching student review data", error);
            }
        };
        fetchData(); // eslint-disable-line
    }, []);

    return (
        <>
            <Box sx={{ marginTop: "16px" }}>
                <Grid container spacing={3}>
                    {reviews.map((review, index) => (
                        <Grid size={6} key={index}>
                            <ReviewOfStudentCard {...review} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default StudentReviewContainer;
