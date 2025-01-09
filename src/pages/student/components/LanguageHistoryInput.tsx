import React, { useEffect, useState } from "react";
import { SelectInput, ShortTextInput } from "web_component";
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
    exam_name_glb: { en: string; kr: string; jp: string };
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
        name: `examHistory[${index}].exam_id`,
    });

    const selectedExam = exams.find((exam) => exam.exam_id === selectedExamId);
    const examResults = selectedExam?.exam_results || [];

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_SERVER_BASE_URL}/api/search/exams`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
                const data = await response.json();
                console.log("data:", data);
                setExams(data.ret);
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
            <CardContent sx={{ padding: "0 !important" }}>
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

                    {/* Exam Name 필드 */}
                    <Grid size={12}>
                        <Controller
                            control={control}
                            name={`examHistory[${index}].exam_id`}
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
                                            option.exam_name_glb.jp
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
                            name={`examHistory[${index}].exam_result`}
                            label="Exam Results"
                            options={examResults.map(
                                (result) => `${result.class}`,
                            )}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default LanguageHistoryInput;
