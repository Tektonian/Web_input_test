import React, { useState, useEffect } from "react";
import { Box, Grid2 as Grid, useMediaQuery, useTheme } from "@mui/material";
import { ReviewOfStudentCard } from "web_component";
import type { APIType } from "api_spec/types";

interface StudentReviewContainerProps {
    student_id: number;
}
const StudentReviewContainer: React.FC<StudentReviewContainerProps> = ({
    student_id,
}) => {
    const [reviews, setReviews] = useState<
        APIType.StudentReviewType.StudentReviewData[]
    >([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/student-reviews/list/${student_id}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
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
                        <Grid size={isMobile ? 12 : 6} key={index}>
                            <ReviewOfStudentCard {...review} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default StudentReviewContainer;
