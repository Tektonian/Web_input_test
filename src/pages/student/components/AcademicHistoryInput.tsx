import React from "react";
import { useFieldArray } from "react-hook-form";
import SchoolInput from "./SchoolInput";
import { Container, Typography, Box, Button } from "@mui/material";
import { NavigationButton } from "web_component";

interface AcademicHistoryInputProps {
    control: any;
    onNext: () => void;
    onPrevious: () => void;
}

const AcademicHistoryInput: React.FC<AcademicHistoryInputProps> = ({
    control,
    onNext,
    onPrevious,
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "academicHistory",
    });

    return (
        <Container>
            {/* 제목 */}
            <Typography variant="h4" gutterBottom>
                Academic History
            </Typography>

            {/* 학력 입력 필드 */}
            <Box>
                {fields.map((field, index) => (
                    <SchoolInput
                        key={field.id}
                        control={control}
                        index={index}
                        onRemove={() => remove(index)}
                    />
                ))}
            </Box>

            {/* 학력 추가 버튼 */}
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

            <Box display="flex" justifyContent="space-between" mt={3}>
                    <NavigationButton label="previous" onClick={onPrevious}/>
                    <NavigationButton label="next" onClick={onNext}/>
            </Box>
        </Container>
    );
};

export default AcademicHistoryInput;
