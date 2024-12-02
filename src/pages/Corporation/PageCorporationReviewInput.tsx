import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { RatingInput } from "web_component";
import { ShortTextInput, LongTextInput } from "web_component";
import {
    Button,
    Container,
    Typography,
    Grid2 as Grid,
    Box,
} from "@mui/material";
import { useParams } from "react-router-dom";

interface CorporationReviewProps {
    review_text?: string;
    prep_requirement?: string;
    work_atmosphere?: string;
    sense_of_achive?: number;
}

const PageCorporationReviewInput: React.FC = () => {
    const { request_id } = useParams<{ request_id: string }>();
    const { control, handleSubmit } = useForm<CorporationReviewProps>({
        defaultValues: {
            review_text: "",
            prep_requirement: "",
            work_atmosphere: "",
            sense_of_achive: 10,
        },
    });

    const onSubmit: SubmitHandler<CorporationReviewProps> = async (data) => {
        const payload = { request_id: request_id, ...data };
        console.log(payload);

        try {
            const response = await fetch("/api/corporation-reviews", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Review submitted successfully:", result);
            } else {
                console.error("Failed to submit review:", response.status);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Submit Your Review
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ mt: 3 }}
            >
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <LongTextInput
                            control={control}
                            name="review_text"
                            label="Review Text"
                        />
                    </Grid>

                    <Grid size={12}>
                        <ShortTextInput
                            control={control}
                            name="prep_requirement"
                            label="Preparation Requirement"
                        />
                    </Grid>

                    <Grid size={12}>
                        <ShortTextInput
                            control={control}
                            name="work_atmosphere"
                            label="Work Atmosphere"
                        />
                    </Grid>

                    <Grid size={12}>
                        <RatingInput
                            control={control}
                            name="sense_of_achive"
                            label="Sense of Achievement (1-10)"
                        />
                    </Grid>

                    <Grid size={12} display="flex" justifyContent="center">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Submit Review
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default PageCorporationReviewInput;
