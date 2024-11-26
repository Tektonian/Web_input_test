import React from "react";
import { Controller } from "react-hook-form";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

interface TimeInputProps {
    control: any;
    name: string;
    label: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ control, name, label }) => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <TimePicker
                    {...field}
                    views={["hours", "minutes"]}
                    format="hh:mm"
                    label={label}
                    onChange={(time) => field.onChange(time)}
                    value={field.value}
                    slotProps={{
                        textField: { fullWidth: true },
                    }}
                />
            )}
        />
    </LocalizationProvider>
);

export default TimeInput;
