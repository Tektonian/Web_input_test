import React from "react";
import {
    Box,
    Button,
    Container,
    Typography,
    Grid2 as Grid,
    TextField,
    Select,
    MenuItem,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import AddressInput from "./components/AddressInput";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../hooks/Session";
import { APIType } from "api_spec/types";
import dayjs from "dayjs";
import { ChipInput } from "web_component";

const RequestInput = () => {
    const methods = useForm<APIType.RequestType.ReqCreateRequest>({
        defaultValues: {
            role: "corp",
            data: {
                consumer_id: -1,
                title: "",
                head_count: 0,
                reward_price: 0,
                currency: "",
                content: "",
                are_needed: [],
                are_required: [],
                prep_material: [],
                start_date: dayjs().format("YYYY-MM-DD"),
                end_date: dayjs().format("YYYY-MM-DD"),
                start_time: dayjs().format("HH:mm"),
                end_time: dayjs().format("HH:mm"),
                address: "",
                address_coordinate: {
                    lat: 0,
                    lng: 0,
                },
            },
        },
    });

    const { handleSubmit, register, setValue } = methods;

    const navigate = useNavigate();

    const onSubmit = async (request: APIType.RequestType.ReqCreateRequest) => {
        console.log("START fetching request:", request);
        try {
            const response = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    data: request.data,
                    role: "corp",
                }),
            });

            if (response.ok) {
                const result = await response.json();
                const requestId = result.request_id;
                console.log("Request ID:", requestId);

                navigate(`/request/${requestId}`);
            } else {
                console.error("Failed to create request:", response.status);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    return (
        <FormProvider {...methods}>
            <Container
                sx={{
                    py: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    maxWidth: "1080px",
                    width: "100%",
                    height: "100vh",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Request Form
                </Typography>

                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                                label="Title"
                                fullWidth
                                {...register("data.title")}
                            />
                        </Grid>

                        <Grid size={4}>
                            <TextField
                                label="Head Count"
                                type="number"
                                fullWidth
                                {...register("data.head_count", {
                                    valueAsNumber: true,
                                })}
                            />
                        </Grid>

                        <Grid size={4}>
                            <TextField
                                label="Reward Price"
                                type="number"
                                fullWidth
                                {...register("data.reward_price", {
                                    valueAsNumber: true,
                                })}
                            />
                        </Grid>

                        <Grid size={4}>
                            <Select
                                label="Currency"
                                fullWidth
                                defaultValue=""
                                {...register("data.currency")}
                            >
                                <MenuItem value="">Select currency</MenuItem>
                                <MenuItem value="jp">jp</MenuItem>
                                <MenuItem value="kr">kr</MenuItem>
                                <MenuItem value="us">us</MenuItem>
                            </Select>
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                label="Start Date"
                                type="date"
                                fullWidth
                                {...register("data.start_date")}
                            />
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                label="End Date"
                                type="date"
                                fullWidth
                                {...register("data.end_date")}
                            />
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                label="Start Time"
                                type="time"
                                fullWidth
                                {...register("data.start_time")}
                            />
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                label="End Time"
                                type="time"
                                fullWidth
                                {...register("data.end_time")}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="Content"
                                multiline
                                rows={4}
                                fullWidth
                                {...register("data.content")}
                            />
                        </Grid>

                        <Grid size={12}>
                            <ChipInput
                                name="data.are_needed"
                                label="Press enter to add skill needed"
                            />
                        </Grid>

                        <Grid size={12}>
                            <ChipInput
                                name="data.are_required"
                                label="Press enter to add skill required"
                            />
                        </Grid>

                        <Grid size={12}>
                            <ChipInput
                                name="data.prep_material"
                                label="Press enter to add preparation material"
                            />
                        </Grid>

                        <Grid size={12}>
                            <AddressInput />
                        </Grid>

                        <Grid size={12} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </FormProvider>
    );
};

export default RequestInput;
