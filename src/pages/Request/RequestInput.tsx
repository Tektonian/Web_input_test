import React from "react";
import { Flex, Box, Grid } from "@radix-ui/themes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useForm } from "react-hook-form";
import { ShortTextInput } from "web_component";
import { LongTextInput } from "web_component";
import { DateInput } from "web_component";
import { TimeInput } from "web_component";
import { SelectInput } from "web_component";
import AddressInput from "./components/AddressInput";

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
    start_time: Date | null;
    end_time: Date | null;
    created_at: Date;
    updated_at?: Date;
    corp_id: number;
    orgn_id: number;
}

const RequestInput: React.FC = () => {
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
            start_date: new Date("2024-11-21"),
            end_date: new Date("2024-11-21"),
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

    const onSubmit = async (data: RequestProfileProps) => {
        try {
            console.log(data);
            const response = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            console.log(data);
            if (response.ok) {
                const result = await response.json();
                console.log("Data successfully submitted:", result);
            } else {
                console.error("Failed to submit data:", response.status);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ width: "512px", height: "1200px" }}
        >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Flex
                    direction="column"
                    align="stretch"
                    justify="center"
                    gap="10"
                >
                    <Grid rows="12" gap="5">
                        <Box width="100%">
                            <ShortTextInput
                                control={control}
                                name="title"
                                label="Title"
                            />
                        </Box>

                        <Box width="100%">
                            <ShortTextInput
                                control={control}
                                name="subtitle"
                                label="Subtitle"
                            />
                        </Box>

                        <Box width="100%">
                            <ShortTextInput
                                control={control}
                                name="head_count"
                                label="Head Count"
                            />
                        </Box>

                        <Box width="100%">
                            <ShortTextInput
                                control={control}
                                name="reward_price"
                                label="Reward Price"
                            />
                            <SelectInput
                                control={control}
                                name="currency"
                                label="Currency"
                                options={["JPY", "KRW", "USD"]}
                            />
                        </Box>

                        <Box width="100%">
                            <DateInput
                                control={control}
                                name="start_date"
                                label="Date"
                            />
                        </Box>

                        <Box width="100%">
                            <TimeInput
                                control={control}
                                name="start_time"
                                label="Start Time"
                            />
                        </Box>

                        <Box width="100%">
                            <TimeInput
                                control={control}
                                name="end_time"
                                label="End Time"
                            />
                        </Box>

                        <Box width="100%">
                            <LongTextInput
                                control={control}
                                name="content"
                                label="Content"
                            />
                        </Box>
                        <Box width="100%">
                            <AddressInput
                                control={control}
                                setValue={setValue}
                            />
                        </Box>
                        <Box width="100%">
                            <button type="submit">Submit</button>
                        </Box>
                    </Grid>
                </Flex>
            </LocalizationProvider>
        </form>
    );
};

export default RequestInput;
