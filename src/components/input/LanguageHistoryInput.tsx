import React from "react";
import { useFieldArray } from "react-hook-form";
import TestInput from "./ExamInput";

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
        <div>
            <h3>Language History</h3>
            {fields.map((field, index) => (
                <TestInput
                    key={field.id}
                    control={control}
                    index={index}
                    onRemove={() => remove(index)}
                />
            ))}
            <button
                type="button"
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
            </button>
            <button type="button" onClick={onNext}>
                Next
            </button>
            <button type="button" onClick={onPrevious}>
                Previous
            </button>
        </div>
    );
};

export default LanguageHistoryInput;
