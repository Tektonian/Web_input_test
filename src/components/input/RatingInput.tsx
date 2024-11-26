import React from "react";
import { Controller } from "react-hook-form";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

interface RatingInputProps {
    control: any;
    name: string;
    label: string;
}

const RatingInput: React.FC<RatingInputProps> = ({ control, name, label }) => (
    <div>
        <Typography gutterBottom>{label}</Typography>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Slider
                    {...field}
                    value={field.value || 10}
                    onChange={(_, value) => field.onChange(value)}
                    step={1}
                    marks
                    min={1}
                    max={10}
                    valueLabelDisplay="auto"
                />
            )}
        />
    </div>
);

export default RatingInput;
