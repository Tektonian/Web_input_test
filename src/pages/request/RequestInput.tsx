import React from "react";
import {
    Box,
    Button,
    Container,
    Typography,
    Grid2 as Grid,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useForm } from "react-hook-form";
import {
    ShortTextInput,
    LongTextInput,
    DateInput,
    TimeInput,
    SelectInput,
} from "web_component";
import AddressInput from "./components/AddressInput";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../hooks/Session";
import { APIType } from "api_spec";
import dayjs from "dayjs";

const RequestInput = () => {
    const { control, setValue, handleSubmit } = useForm<
        APIType.RequestType.ReqCreateRequest
    >({
        defaultValues: {
            role: "",
            data: {
                consumer_id: -1,
                title: "",
                head_count: 0,
                reward_price: 0,
                currency: "",
                content: "",
                are_needed: [],
                are_required: [],
                start_date: new Date(),
                end_date: new Date(),
                start_time: dayjs().format("HH:mm"),
                end_time: dayjs().format("HH:mm"),
                address: "",
                address_coordinate: {
                    type: "Point",
                    coordinates: [0, 0],
                },
                prep_material: [],
                created_at: new Date(),
            },
        },
    });

    const session = useSession();
    const roles = session.data?.user?.roles;

    const navigate = useNavigate();

    const onSubmit = async (request: APIType.RequestType.ReqCreateRequest) => {
        try {
            const response = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                // TODO: change later of role
                body: JSON.stringify({
                    data: request.data,
                    role: request.role,
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
        <Container>
            <Typography variant="h4" gutterBottom>
                Request Form
            </Typography>

            <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
            >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <ShortTextInput
                                control={control}
                                name="title"
                                label="Title"
                            />
                        </Grid>

                        <Grid size={4}>
                            <ShortTextInput
                                control={control}
                                name="head_count"
                                label="Head Count"
                            />
                        </Grid>

                        <Grid size={4}>
                            <ShortTextInput
                                control={control}
                                name="reward_price"
                                label="Reward Price"
                            />
                        </Grid>
                        <Grid size={4}>
                            <SelectInput
                                control={control}
                                name="currency"
                                label="Currency"
                                options={["JPY", "KRW", "USD"]}
                            />
                        </Grid>

                        <Grid size={6}>
                            <DateInput
                                control={control}
                                name="start_date"
                                label="Start Date"
                            />
                        </Grid>

                        <Grid size={6}>
                            <DateInput
                                control={control}
                                name="end_date"
                                label="End Date"
                            />
                        </Grid>

                        <Grid size={6}>
                            <TimeInput
                                control={control}
                                name="start_time"
                                label="Start Time"
                            />
                        </Grid>

                        <Grid size={6}>
                            <TimeInput
                                control={control}
                                name="end_time"
                                label="End Time"
                            />
                        </Grid>

                        <Grid size={12}>
                            <LongTextInput
                                control={control}
                                name="content"
                                label="Content"
                            />
                        </Grid>

                        <Grid size={12}>
                            <AddressInput
                                control={control}
                                setValue={setValue}
                            />
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
                </LocalizationProvider>
            </Box>
        </Container>
    );
};

export default RequestInput;
