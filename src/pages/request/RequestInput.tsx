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
import type { APIType } from "api_spec";
import dayjs from "dayjs";
import { ChipInput } from "web_component";

const RequestInput = () => {
    const { control, setValue, handleSubmit } =
        useForm<APIType.RequestType.ReqCreateRequest>({
            defaultValues: {
                role: "normal",
                data: {
                    title: "",
                    head_count: 0,
                    reward_price: 0,
                    currency: "KO",
                    content: "",
                    are_needed: [],
                    are_required: [],
                    start_date: new Date().toISOString().split("T")[0],
                    end_date: new Date().toISOString().split("T")[0],
                    provide_food: false,
                    provide_trans_exp: false,
                    start_time: dayjs().format("HH:MM"),
                    end_time: dayjs().format("HH:MM"),
                    address: "",
                    address_coordinate: {
                        lat: 0,
                        lng: 0,
                    },
                    prep_material: [],
                },
            },
        },
    });

    const { handleSubmit, register, setValue } = methods;

    const navigate = useNavigate();

    const onSubmit = async (request: APIType.RequestType.ReqCreateRequest) => {
        console.log("START fetching request:", request);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_BASE_URL}/api/requests`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    // TODO: change later of role
                    body: JSON.stringify({
                        data: request.data,
                        role: request.role,
                    }),
                },
            );

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
        <Container
            sx={{
                py: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "1080px",
                width: "100%",
                height: "100%",
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
                        <ShortTextInput
                            control={control}
                            name="data.title"
                            label="Title"
                        />
                    </Grid>

                    <Grid size={4}>
                        <ShortTextInput
                            control={control}
                            name="data.head_count"
                            label="Head Count"
                        />
                    </Grid>

                    <Grid size={4}>
                        <ShortTextInput
                            control={control}
                            name="data.reward_price"
                            label="Reward Price"
                        />
                    </Grid>
                    <Grid size={4}>
                        <SelectInput
                            control={control}
                            name="data.currency"
                            options={[
                                { value: "KO", label: "원" },
                                { value: "JP", label: "엔" },
                                { value: "US", label: "달러" },
                            ]}
                        />
                    </Grid>

                    <Grid size={6}>
                        <DateInput
                            control={control}
                            name="data.start_date"
                            label="Start Date"
                        />
                    </Grid>

                    <Grid size={6}>
                        <DateInput
                            control={control}
                            name="data.end_date"
                            label="End Date"
                        />
                    </Grid>

                    <Grid size={12}>
                        <LongTextInput
                            control={control}
                            name="data.content"
                            label="Content"
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
