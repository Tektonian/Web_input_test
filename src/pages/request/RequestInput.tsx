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
import { ShortTextInput } from "web_component";
import { LongTextInput } from "web_component";
import { DateInput } from "web_component";
import { TimeInput } from "web_component";
import { SelectInput } from "web_component";
import AddressInput from "./components/AddressInput";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../hooks/Session";
export interface RequestProfileProps {
    consumer_id: number;
    title: string;
    subtitle: string;
    head_count: number;
    reward_price: number;
    currency: "USD" | "JPY" | "KRW" | "";
    content: string;
    are_needed?: string;
    are_required?: string;
    start_date: Date;
    end_date: Date;
    address: string;
    address_coordinate: {
        type: "Point";
        coordinates: [lng: number, lat: number];
    };
    provide_food: boolean;
    provide_trans_exp: boolean;
    prep_material: string;
    status: number;
    start_time: Date | string | null;
    end_time: Date | string | null;
    created_at: Date;
    updated_at?: Date;
    corp_id: number;
    orgn_id: number;
}

const RequestInput = ({
    role = "corp",
}: {
    role?: "corp" | "orgn" | "normal";
}) => {
    const { control, setValue, handleSubmit } = useForm<RequestProfileProps>({
        defaultValues: {
            consumer_id: 2,
            title: "",
            subtitle: "",
            head_count: 0,
            reward_price: 0,
            currency: "",
            content: "",
            are_needed: "",
            are_required: "",
            start_date: new Date(),
            end_date: new Date(),
            start_time: null,
            end_time: null,
            address: "",
            address_coordinate: {
                type: "Point",
                coordinates: [0, 0],
            },
            prep_material: "",
            created_at: new Date(),
        },
    });

    const session = useSession();

    const navigate = useNavigate();

    const onSubmit = async (data: RequestProfileProps) => {
        data.start_time = new Date(data.start_time ?? "").toLocaleTimeString(
            "it-IT",
        );
        data.end_time = new Date(data.end_time ?? "").toLocaleTimeString(
            "it-IT",
        );
        try {
            const response = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                // TODO: change later of role
                body: JSON.stringify({ data: data, role: role }),
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

                        <Grid size={12}>
                            <ShortTextInput
                                control={control}
                                name="subtitle"
                                label="Subtitle"
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
