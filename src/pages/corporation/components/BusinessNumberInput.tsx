import React from "react";
import { ShortTextInput } from "web_component";
import {
    Button,
    Container,
    Typography,
    Box,
    Grid2 as Grid,
} from "@mui/material";

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
        <Container>
            <Typography variant="h4" gutterBottom>
                Enter Business Number
            </Typography>

            <Box
                component="form"
                noValidate
                sx={{
                    mt: 3,
                }}
            >
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <ShortTextInput
                            control={control}
                            name="businessNumber"
                            label="Business Number"
                        />
                    </Grid>

                    <Grid
                        size={12}
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onPrevious}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onNext}
                        >
                            Next
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default BusinessNumberInput;
