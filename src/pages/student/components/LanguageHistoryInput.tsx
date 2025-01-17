import React, { useEffect, useState } from "react";
import { SelectInput, ShortTextInput } from "@mesh/web_component";
import {
    Box,
    Typography,
    Grid2 as Grid,
    IconButton,
    Autocomplete,
    TextField,
    Card,
    CardContent,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Controller, useWatch } from "react-hook-form";
import "@fontsource/noto-sans-kr";

interface LanguageHistoryInputProps {
    control: any;
    index: number;
    onRemove: () => void;
}

interface Exam {
    exam_id: number;
    exam_name_glb: { KO: string; US: string; JP: string };
    exam_result_type: string;
    exam_results: { class: string; level: number }[];
    lang_country_code: string;
}

const LanguageHistoryInput: React.FC<LanguageHistoryInputProps> = ({
    control,
    index,
    onRemove,
}) => {
    const [exams, setExams] = useState<Exam[]>([]);
    const selectedExamId = useWatch({
        control,
        name: `exam_history[${index}].exam_id`,
    });

    const selectedExam = exams.find((exam) => exam.exam_id === selectedExamId);
    const examResults = selectedExam?.exam_results || [];

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/search/exams`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
                const data = await response.json();
                console.log("data:", data);
                setExams(data);
            } catch (error) {
                console.error("Error fetching exam data:", error);
            }
        };
        fetchExams(); // eslint-disable-line
    }, []);

    return (
        <Card
            sx={{
                border: "1px solid #d3d3d3",
                borderRadius: "16px",
                padding: "24px",
                backgroundColor: "#ffffff",
                marginBottom: "16px",
                fontFamily: "Noto Sans KR",
            }}
        >
            <IconButton
                onClick={onRemove}
                aria-label="Remove Language History"
                sx={{
                    position: "absolute",
                    top: 24,
                    right: 24,
                    color: "#888",
                }}
            >
                <RemoveCircleOutlineIcon />
            </IconButton>
            <CardContent sx={{ padding: "0 !important" }}>
                <Grid container spacing={2} alignItems="center">
                    {/* 제목 및 Remove 버튼 */}
                    <Grid size={12}>
                        <Typography variant="h6" gutterBottom>
                            Language History {index + 1}
                        </Typography>
                    </Grid>

                    {/* Exam Name 필드 */}
                    <Grid size={12}>
                        <Controller
                            control={control}
                            name={`exam_history[${index}].exam_id`}
                            render={({ field }) => {
                                const { onChange, value } = field;
                                const selectedExam =
                                    exams.find(
                                        (exam) => exam.exam_id === value,
                                    ) || null;
                                return (
                                    <Autocomplete
                                        options={exams}
                                        getOptionLabel={(option) =>
                                            option.exam_name_glb.KO
                                        }
                                        value={selectedExam}
                                        onChange={(_, newValue) => {
                                            onChange(
                                                newValue
                                                    ? newValue.exam_id
                                                    : "",
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Exam Name"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                        disablePortal
                                    />
                                );
                            }}
                        />
                    </Grid>

                    {/* Exam Results 필드 */}
                    <Grid size={12}>
                        <SelectInput
                            control={control}
                            name={`exam_history[${index}].exam_result`}
                            options={examResults.map((result) => ({
                                value: result.level,
                                label: `${result.class}`,
                            }))}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default LanguageHistoryInput;
