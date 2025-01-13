import { Box, Grid2 as Grid, useMediaQuery, useTheme } from "@mui/material";
import type { APIType } from "api_spec";
import React, { useEffect, useState } from "react";
import { ReviewOfStudentCard } from "web_component";

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
                    `${process.env.REACT_APP_SERVER_BASE_URL}/api/student-reviews/list/${student_id}`,
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
