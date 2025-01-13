import React from "react";
import { useFieldArray } from "react-hook-form";
import AcademicHistoryInput from "./AcademicHistoryInput";
import { Box, Button, Card, CardContent } from "@mui/material";
import type { Control, FieldValues } from "react-hook-form";
import type { APIType } from "api_spec";

interface AcademicHistoryListInputProps {
    control: Control<APIType.StudentType.ReqCreateStudentProfile>;
}

const AcademicHistoryListInput: React.FC<AcademicHistoryListInputProps> = ({
    control,
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "academic_history",
    });

    return (
        <Card
            sx={{
                maxWidth: 1080,
                margin: "auto",
                borderRadius: "16px",
                fontFamily: "Noto Sans KR",
                color: "rgba(0, 0, 0, 0.7)",
                backgroundColor: "#f5f5f5",
                boxShadow: "none",
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            <CardContent>
                <Box>
                    {fields.map((field, index) => (
                        <AcademicHistoryInput
                            key={field.id}
                            control={control}
                            index={index}
                            onRemove={() => remove(index)}
                        />
                    ))}
                </Box>

                <Box textAlign="center" mb={2}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                            append({
                                degree: 0,
                                faculty: "",
                                school_id: 1,
                                start_date: "",
                                end_date: "",
                                status: 0,
                            })
                        }
                    >
                        Add Academic History
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AcademicHistoryListInput;
