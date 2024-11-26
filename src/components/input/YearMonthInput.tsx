import React from "react";
import { Controller } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

interface DateInputProps {
    control: any;
    name: string;
    label: string;
}

const DateInput: React.FC<DateInputProps> = ({ control, name, label }) => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <DatePicker
                    {...field}
                    label={label}
                    views={["year", "month"]}
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                    slotProps={{
                        textField: { fullWidth: true },
                    }}
                />
            )}
        />
    </LocalizationProvider>
);

export default DateInput;
