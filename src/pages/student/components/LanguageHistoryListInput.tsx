import React from "react";
import { useFieldArray } from "react-hook-form";
import LanguageHistoryInput from "./LanguageHistoryInput";
import { Box, Button, Card, CardContent } from "@mui/material";
import type { APIType } from "api_spec";
import type { Control } from "react-hook-form";
interface LanguageHistoryListInputProps {
    control: Control<APIType.StudentType.ReqCreateStudentProfile>;
}

const LanguageHistoryListInput: React.FC<LanguageHistoryListInputProps> = ({
    control,
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "exam_history",
    });

    return (
        <Card
            sx={{
                minHeight: 300,
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
                        <LanguageHistoryInput
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
                                exam_id: 0,
                                level: 1,
                            })
                        }
                    >
                        Add Language History
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default LanguageHistoryListInput;
