import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { RatingInput } from "@mesh/web_component";
import { ShortTextInput } from "@mesh/web_component";
import Button from "@mui/material/Button";

export interface ReviewProps {
    was_late: number;
    was_proactive: number;
    was_diligent: number;
    commu_ability: number;
    lang_fluent: number;
    goal_fulfillment: number;
    want_cowork: number;
    praise?: string;
    need_improve?: string;
}

interface StudentReviewInputProps {
    consumer_id: number;
    request_id: number;
}

const StudentReviewInput: React.FC<StudentReviewInputProps> = ({
    consumer_id,
    request_id,
}) => {
    const { control, handleSubmit } = useForm<ReviewProps>({
        defaultValues: {
            was_late: 10,
            was_proactive: 10,
            was_diligent: 10,
            commu_ability: 10,
            lang_fluent: 10,
            goal_fulfillment: 10,
            want_cowork: 10,
            praise: "",
            need_improve: "",
        },
    });

    const onSubmit: SubmitHandler<ReviewProps> = async (data) => {
        const payload = { ...data, consumer_id, request_id };

        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/student-reviews`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );

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
            <h2>Submit Student Review</h2>

            {/* Was Late */}
            <RatingInput
                control={control}
                name="was_late"
                label="Was Late (1-10)"
            />

            {/* Was Proactive */}
            <RatingInput
                control={control}
                name="was_proactive"
                label="Proactivity (1-10)"
            />

            {/* Was Diligent */}
            <RatingInput
                control={control}
                name="was_diligent"
                label="Diligence (1-10)"
            />

            {/* Communication Ability */}
            <RatingInput
                control={control}
                name="commu_ability"
                label="Communication Ability (1-10)"
            />

            {/* Language Fluency */}
            <RatingInput
                control={control}
                name="lang_fluent"
                label="Language Fluency (1-10)"
            />

            {/* Goal Fulfillment */}
            <RatingInput
                control={control}
                name="goal_fulfillment"
                label="Goal Fulfillment (1-10)"
            />

            {/* Want to Cowork Again */}
            <RatingInput
                control={control}
                name="want_cowork"
                label="Want to Cowork Again (1-10)"
            />

            {/* Praise */}
            <ShortTextInput control={control} name="praise" label="Praise" />

            {/* Need to Improve */}
            <ShortTextInput
                control={control}
                name="need_improve"
                label="Areas for Improvement"
            />

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary">
                Submit Review
            </Button>
        </form>
    );
};

export default StudentReviewInput;
