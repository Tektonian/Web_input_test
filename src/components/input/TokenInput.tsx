import React from "react";
import { ShortTextInput } from "web_component";

export interface TokenInputProps {
    control: any;
    onSubmit: () => void;
    onPrevious: () => void;
}

const TokenInput: React.FC<TokenInputProps> = ({
    control,
    onSubmit,
    onPrevious,
}) => {
    return (
        <div>
            <h3>Enter Verification Token</h3>
            <ShortTextInput control={control} name="token" label="Token" />
            <button type="submit" onClick={onSubmit}>
                Submit
            </button>
            <button type="submit" onClick={onPrevious}>
                Previous
            </button>
        </div>
    );
};

export default TokenInput;
