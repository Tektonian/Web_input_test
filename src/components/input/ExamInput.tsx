import React from "react";
import ShortTextInput from "./ShortTextInput";
import { Container, Typography, Button, Grid2 as Grid } from "@mui/material";

interface ExamInputProps {
    control: any;
    index: number;
    onRemove: () => void;
}

const ExamInput: React.FC<ExamInputProps> = ({ control, index, onRemove }) => {
    return (
        <Container
            sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 3, my: 2 }}
        >
            <Typography variant="h6" gutterBottom>
                Language History {index + 1}
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <ShortTextInput
                        control={control}
                        name={`examHistory[${index}].language`}
                        label="Language"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <ShortTextInput
                        control={control}
                        name={`examHistory[${index}].exam_name`}
                        label="Exam Name"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <ShortTextInput
                        control={control}
                        name={`examHistory[${index}].exam_result`}
                        label="Exam Result"
                    />
                </Grid>

                <Grid
                    size={{ xs: 12 }}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onRemove}
                        sx={{ mt: { xs: 2, sm: 0 } }}
                    >
                        Remove
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ExamInput;
