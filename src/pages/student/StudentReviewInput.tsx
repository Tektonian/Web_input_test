import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
    Container,
    Typography,
    Grid2 as Grid,
    Box,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
} from "@mui/material";
import { RatingInput } from "web_component";

export interface StudentReviewAttributes {
    corp_id?: number;
    orgn_id?: number;
    consumer_id: number;
    student_id: number;
    request_id: number;
    request_url: string;
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

const StudentReviewInput = () => {
    const { control, handleSubmit } = useForm<StudentReviewAttributes>({
        defaultValues: {
            consumer_id: -1,
            student_id: -1, //TODO: 리퀘스트에 참여한 학생 명단 데이터는 어디에?
            request_id: -1,
            request_url: "",
            was_late: 0,
            was_proactive: 5,
            was_diligent: 5,
            commu_ability: 5,
            lang_fluent: 5,
            goal_fulfillment: 5,
            want_cowork: 5,
            praise: "",
            need_improve: "",
        },
    });

    const onSubmit: SubmitHandler<StudentReviewAttributes> = async (data) => {
        try {
            const response = await fetch("/api/student-reviews", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
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
                Student Performance Review
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ mt: 3 }}
            >
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <Typography variant="h6" gutterBottom>
                            Attendance
                        </Typography>
                        <Controller
                            name="was_late"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup {...field} row>
                                    <FormControlLabel
                                        value={0}
                                        control={<Radio />}
                                        label="On Time"
                                    />
                                    <FormControlLabel
                                        value={1}
                                        control={<Radio />}
                                        label="Late"
                                    />
                                    <FormControlLabel
                                        value={2}
                                        control={<Radio />}
                                        label="Absent"
                                    />
                                </RadioGroup>
                            )}
                        />
                    </Grid>

                    <Grid size={12}>
                        <RatingInput
                            control={control}
                            name="was_proactive"
                            label="Proactivity"
                        />
                    </Grid>
                    <Grid size={12}>
                        <RatingInput
                            control={control}
                            name="was_diligent"
                            label="Diligence"
                        />
                    </Grid>
                    <Grid size={12}>
                        <RatingInput
                            control={control}
                            name="commu_ability"
                            label="Communication Ability"
                        />
                    </Grid>
                    <Grid size={12}>
                        <RatingInput
                            control={control}
                            name="lang_fluent"
                            label="Language Fluency"
                        />
                    </Grid>
                    <Grid size={12}>
                        <RatingInput
                            control={control}
                            name="goal_fulfillment"
                            label="Goal Fulfillment"
                        />
                    </Grid>
                    <Grid size={12}>
                        <RatingInput
                            control={control}
                            name="want_cowork"
                            label="Willingness to Work Again"
                        />
                    </Grid>

                    <Grid size={12}>
                        <Controller
                            name="praise"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Praise"
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Controller
                            name="need_improve"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Areas for Improvement"
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            )}
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

export default StudentReviewInput;

export {};
