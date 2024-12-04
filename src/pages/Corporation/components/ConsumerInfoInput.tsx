import React from "react";
import { Controller } from "react-hook-form";
import {
    TextField,
    Button,
    Grid2 as Grid,
    Typography,
    Container,
    Box,
} from "@mui/material";

export interface ConsumerAttributes {
    user_id?: any;
    corp_id?: number; //서버에서 받도록
    orgn_id?: number;
    consumer_type: string;
    consumer_email: string;
    consumer_verified?: Date;
    phone_number: string;
}

interface ConsumerInfoInputProps {
    control: any;
    onNext: () => void;
    onPrevious: () => void;
}

const ConsumerInfoInput: React.FC<ConsumerInfoInputProps> = ({
    control,
    onNext,
    onPrevious,
}) => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Phone Number
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
                        <Controller
                            name="phone_number"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone Number"
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
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

export default ConsumerInfoInput;
