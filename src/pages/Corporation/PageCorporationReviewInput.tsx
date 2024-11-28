import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { RatingInput } from "web_component";
import { ShortTextInput } from "web_component";
import Button from "@mui/material/Button";

interface CorporationReviewProps {
    review_text?: string;
    prep_requirement?: string;
    work_atmosphere?: string;
    sense_of_achive?: number;
}

interface PageCorporationReviewInputProps {
    student_id: number;
    request_id: number;
}

const PageCorporationReviewInput: React.FC<PageCorporationReviewInputProps> = ({
    student_id,
    request_id,
}) => {
    const { control, handleSubmit } = useForm<CorporationReviewProps>({
        defaultValues: {
            review_text: "",
            prep_requirement: "",
            work_atmosphere: "",
            sense_of_achive: 10,
        },
    });

    const onSubmit: SubmitHandler<CorporationReviewProps> = async (data) => {
        const payload = { ...data, student_id, request_id };

        try {
            const response = await fetch("/api/corporation-reviews", {
                method: "POST",
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Submit Your Review</h2>

            {/* Review Text */}
            <ShortTextInput
                control={control}
                name="review_text"
                label="Review Text"
            />

            {/* Preparation Requirement */}
            <ShortTextInput
                control={control}
                name="prep_requirement"
                label="Preparation Requirement"
            />

            {/* Work Atmosphere */}
            <ShortTextInput
                control={control}
                name="work_atmosphere"
                label="Work Atmosphere"
            />

            {/* Sense of Achievement */}
            <RatingInput
                control={control}
                name="sense_of_achive"
                label="Sense of Achievement (1-10)"
            />

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary">
                Submit Review
            </Button>
        </form>
    );
};

export default PageCorporationReviewInput;
