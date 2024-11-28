import React from "react";
import GlobalNameInput from "./GlobalNameInput";
import { ShortTextInput } from "web_component";

interface BasicInfoInputProps {
    control: any;
    onNext: () => void;
    onPrevious: () => void;
}

const BasicInfoInput: React.FC<BasicInfoInputProps> = ({
    control,
    onNext,
    onPrevious,
}) => {
    return (
        <div>
            <h3>Basic Information</h3>
            <GlobalNameInput
                control={control}
                name="name_glb"
                availableLanguages={["en", "kr", "jp"]}
            />
            <ShortTextInput control={control} name="age" label="Age" />
            <ShortTextInput control={control} name="gender" label="Gender" />
            <ShortTextInput
                control={control}
                name="nationality"
                label="Nationality"
            />
            <ShortTextInput
                control={control}
                name="phone_number"
                label="Phone Number"
            />
            <ShortTextInput
                control={control}
                name="emergency_contact"
                label="Emergency Contact"
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

export default BasicInfoInput;
