import React from "react";
import { useFieldArray } from "react-hook-form";
import ExamInput from "./ExamInput";
import { Container, Typography, Box, Button } from "@mui/material";
import { NavigationButton } from "web_component";

interface LanguageHistoryInputProps {
    control: any;
    onNext: () => void;
    onPrevious: () => void;
}

const LanguageHistoryInput: React.FC<LanguageHistoryInputProps> = ({
    control,
    onNext,
    onPrevious,
}) => {
    // useFieldArray에서 상위 컴포넌트에서 전달받은 control 사용
    const { fields, append, remove } = useFieldArray({
        control,
        name: "examHistory",
    });

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Language History
            </Typography>

            <Box>
                {fields.map((field, index) => (
                    <ExamInput
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
                            language: "",
                            exam_name: "",
                            exam_result: "",
                            level: 0,
                        })
                    }
                >
                    Add Language History
                </Button>
            </Box>

            <Box display="flex" justifyContent="space-between" mt={3}>
                    <NavigationButton label="previous" onClick={onPrevious}/>
                    <NavigationButton label="next" onClick={onNext}/>
            </Box>
        </Container>
    );
};

export default LanguageHistoryInput;
