import React from "react";
import { useFieldArray } from "react-hook-form";
import LanguageHistoryInput from "./LanguageHistoryInput";
import { Box, Button, Card } from "@mui/material";
import { NavigationButton } from "web_component";

interface LanguageHistoryListInputProps {
    control: any;
    onNext: () => void;
    onPrevious: () => void;
}

const LanguageHistoryListInput: React.FC<LanguageHistoryListInputProps> = ({
    control,
    onNext,
    onPrevious,
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "examHistory",
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
                <NavigationButton label="previous" onClick={onPrevious} />
                <NavigationButton label="next" onClick={onNext} />
            </Box>
        </Card>
    );
};

export default LanguageHistoryListInput;
