import React, { useState, useEffect } from "react";
import { Box, Grid2 as Grid, useMediaQuery, useTheme } from "@mui/material";
import { ReviewOfCorpCard } from "web_component";
import type { APIType } from "api_spec";

interface CorporationReviewContainerProps {
    corp_id: number;
}

const CorporationReviewContainer: React.FC<CorporationReviewContainerProps> = ({
    corp_id,
}) => {
    const [corpReview, setCorpReviews] =
        useState<APIType.CorporationReviewType.ResGetCorpReview>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/corporation-reviews/${corp_id}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
                const data: APIType.CorporationReviewType.ResGetCorpReview =
                    await response.json();
                setCorpReviews(data);
            } catch (error) {
                console.error("Error fetching corporation review data", error);
            }
        };
        fetchData(); // eslint-disable-line
    }, []);

    return (
        <>
            <Box sx={{ marginTop: "16px" }}>
                <Grid container spacing={3}>
                    {corpReview?.review.map((review, index) => (
                        <Grid size={isMobile ? 12 : 6} key={index}>
                            <ReviewOfCorpCard {...review} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default CorporationReviewContainer;
