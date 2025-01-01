import React from "react";
import { Control, Controller } from "react-hook-form";
import {
    TextField,
    Grid2 as Grid,
    Typography,
    Box,
    Card,
    CardContent,
} from "@mui/material";

interface ConsumerInfoInputProps {
    control: Control;
}

const ConsumerInfoInput: React.FC<ConsumerInfoInputProps> = ({ control }) => {
    return (
        <Card
            sx={{
                maxWidth: 1080,
                margin: "auto",
                borderRadius: "16px",
                fontFamily: "Noto Sans KR",
                backgroundColor: "#ffffff",
                border: "1px solid #d3d3d3",
                boxShadow: "none",
            }}
        >
            <CardContent sx={{ padding: 3 }}>
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
                                name="phoneNumber"
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
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ConsumerInfoInput;
