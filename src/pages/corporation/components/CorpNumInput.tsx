import React, { useState } from "react";
import {
    Button,
    Container,
    Typography,
    Box,
    Grid2 as Grid,
    TextField,
} from "@mui/material";

interface CorpNumInputProps {
    onCorpNumSubmit: (response: any) => void;
}

const CorpNumInput: React.FC<CorpNumInputProps> = ({ onCorpNumSubmit }) => {
    const [corpNum, setCorpNum] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/corporations/profile/check?corpNum=${corpNum}`,
                {
                    method: "GET",
                },
            );

            if (!response.ok) {
                throw new Error("Failed to validate corporation number");
            }

            const data = await response.json();
            onCorpNumSubmit(data);
        } catch (err) {
            console.error("An error occurred", err);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Enter Corporation Number
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
                        <TextField
                            label="Corporation Number"
                            variant="outlined"
                            fullWidth
                            value={corpNum}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => setCorpNum(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 3,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!corpNum}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default CorpNumInput;
