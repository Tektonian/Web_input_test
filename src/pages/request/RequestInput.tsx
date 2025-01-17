import {
    Box,
    Button,
    Container,
    Grid2 as Grid,
    TextField,
    Typography,
} from "@mui/material";
import type { APIType } from "api_spec";
import dayjs from "dayjs";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AddressInput from "./components/AddressInput";
import {
    ShortTextInput,
    LongTextInput,
    SelectInput,
    TimeInput,
    DateInput,
} from "web_component";

const RequestInput = () => {
    const methods = useForm<APIType.RequestType.ReqCreateRequest>({
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
    });

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
    const { control, handleSubmit } = methods;
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
                                label="제목"
                            />
                        </Grid>

                        <Grid size={{ xs: 3, sm: 2 }}>
                            <ShortTextInput
                                control={control}
                                name="data.head_count"
                                label="모집 인원"
                            />
                        </Grid>

                        <Grid size={{ xs: 6, sm: 3 }}>
                            <ShortTextInput
                                control={control}
                                name="data.reward_price"
                                label="리워드"
                            />
                        </Grid>
                        <Grid size={{ xs: 3, sm: 2 }}>
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

                        <Grid size={{ xs: 6, sm: 2.5 }}>
                            <DateInput
                                control={control}
                                name="data.start_date"
                                label="Start Date"
                            />
                        </Grid>

                        <Grid size={{ xs: 6, sm: 2.5 }}>
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
                            <AddressInput />
                        </Grid>

                        <Grid size={12} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                            >
                                제출하기
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </FormProvider>
    );
};

export default RequestInput;
