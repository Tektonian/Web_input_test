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
import type { APIType } from "api_spec";
import dayjs from "dayjs";

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
                    start_date: new Date(),
                    end_date: new Date(),
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
        });

    const session = useSession();
    const roles = session.data?.user?.roles;

    const navigate = useNavigate();

    const onSubmit = async (request: APIType.RequestType.ReqCreateRequest) => {
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

                    <Grid size={12}>
                        <AddressInput control={control} setValue={setValue} />
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
    );
};

export default RequestInput;
