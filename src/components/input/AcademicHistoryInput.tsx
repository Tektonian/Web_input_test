import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import SchoolInput from "./SchoolInput";

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
    const { watch } = useForm();
    console.log(watch("academicHistory"));

    return (
        <div>
            <h3>Academic History</h3>
            {fields.map((field, index) => (
                <SchoolInput
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

export default AcademicHistoryInput;
