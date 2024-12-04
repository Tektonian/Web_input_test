import React from "react";
import { ShortTextInput } from "web_component";
import {
    Button,
    Container,
    Grid2 as Grid,
    Typography,
    Box,
} from "@mui/material";

interface CorpProfileProps {
    control: any;
    onNext: () => void;
    onPrevious: () => void;
}

const CorpProfileInput: React.FC<CorpProfileProps> = ({
    control,
    onNext,
    onPrevious,
}) => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Corporate Profile
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
                            name="name"
                            label="Company Name"
                        />
                    </Grid>

                    <Grid size={12}>
                        <ShortTextInput
                            control={control}
                            name="nationality"
                            label="Nationality"
                        />
                    </Grid>

                    <Grid size={12}>
                        <ShortTextInput
                            control={control}
                            name="corp_address"
                            label="Corporate Address"
                        />
                    </Grid>

                    <Grid size={12}>
                        <ShortTextInput
                            control={control}
                            name="corp_num"
                            label="Corporate Number"
                        />
                    </Grid>

                    <Grid size={12}>
                        <ShortTextInput
                            control={control}
                            name="review_count"
                            label="Review Count"
                        />
                    </Grid>

                    <Grid size={12}>
                        <ShortTextInput
                            control={control}
                            name="biz_type"
                            label="Business Type"
                        />
                    </Grid>

                    <Grid size={12}>
                        <ShortTextInput
                            control={control}
                            name="logo_image"
                            label="Logo Image URL"
                        />
                    </Grid>

                    <Grid size={12}>
                        <ShortTextInput
                            control={control}
                            name="homepage_url"
                            label="Homepage URL"
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

export default CorpProfileInput;
