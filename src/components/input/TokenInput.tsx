import React from "react";
import { ShortTextInput, NavigationButton } from "web_component";
import { Box } from "@mui/material";

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
            <Box display="flex" justifyContent="space-between" mt={3}>
                    <NavigationButton label="previous" onClick={onPrevious}/>
            </Box>
        </div>
    );
};

export default TokenInput;
