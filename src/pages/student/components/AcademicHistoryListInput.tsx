import React from "react";
import { useFieldArray } from "react-hook-form";
import AcademicHistoryInput from "./AcademicHistoryInput";
import { Box, Button, Card, CardContent } from "@mui/material";

interface AcademicHistoryListInputProps {
    control: any;
}

const AcademicHistoryListInput: React.FC<AcademicHistoryListInputProps> = ({
    control,
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "academicHistory",
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
                                degree: "",
                                faculty: "",
                                school_id: 1,
                                start_date: "",
                                end_date: "",
                                status: "In Progress",
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
