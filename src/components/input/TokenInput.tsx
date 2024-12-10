import React from "react";
import { Container, Typography } from "@mui/material";
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
        <Container>
            <Typography variant="h4" gutterBottom>
                Enter Verification Token
            </Typography>
            <ShortTextInput control={control} name="token" label="Token" />
            <Box display="flex" justifyContent="space-between" mt={3}>
                <NavigationButton label="previous" onClick={onPrevious} />
                <NavigationButton label="next" onClick={onSubmit} />
            </Box>
        </Container>
    );
};

export default TokenInput;
