import React from "react";
import { ShortTextInput } from "web_component";

interface BusinessNumberInputProps {
    control: any;
    onNext: () => void;
    onPrevious: () => void;
}

const BusinessNumberInput: React.FC<BusinessNumberInputProps> = ({
    control,
    onNext,
    onPrevious,
}) => {
    return (
        <div>
            <h3>Enter Business Number</h3>
            <ShortTextInput
                control={control}
                name="businessNumber"
                label="Business Number"
            />
            <button type="button" onClick={onNext}>
                Next
            </button>
            <button type="button" onClick={onPrevious}>
                Previous
            </button>
        </div>
    );
};

export default BusinessNumberInput;
