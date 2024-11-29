import React from "react";
import { ShortTextInput } from "web_component";
import { Box, Typography, Grid2 as Grid, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

interface ExamInputProps {
    control: any;
    index: number;
    onRemove: () => void;
}

const ExamInput: React.FC<ExamInputProps> = ({ control, index, onRemove }) => {
    return (
        <Box
            sx={{
                border: "1px solid #d4d4d4",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#f9f9f9",
                marginBottom: "16px",
            }}
        >
            <Grid container spacing={2} alignItems="center">
                {/* 제목 및 Remove 버튼 */}
                <Grid size={11.5}>
                    <Typography variant="h6" gutterBottom>
                        Language History {index + 1}
                    </Typography>
                </Grid>
                <Grid size={0.5}>
                    <IconButton
                        onClick={onRemove}
                        aria-label="Remove Language History"
                        sx={{
                            color: "#888",
                        }}
                    >
                        <RemoveCircleOutlineIcon />
                    </IconButton>
                </Grid>

                {/* Exam Name 및 Exam Result 입력 필드 */}
                <Grid size={12} >
                    <ShortTextInput
                        control={control}
                        name={`examHistory[${index}].exam_name`}
                        label="Exam Name"
                    />
                </Grid>
                <Grid size={12} >
                    <ShortTextInput
                        control={control}
                        name={`examHistory[${index}].exam_result`}
                        label="Exam Result"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ExamInput;
