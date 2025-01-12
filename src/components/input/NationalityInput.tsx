import React from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

const countries = [
    { code: "ko", name: "Korea" },
    { code: "jp", name: "Japan" },
    { code: "us", name: "United States" },
    { code: "en", name: "England" },
    { code: "cn", name: "China" },
];

export interface NationalityInputProps {
    control: any;
    name: string;
    label: string;
}

const NationalityInput: React.FC<NationalityInputProps> = ({
    control,
    name,
    label,
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const { onChange, value } = field;
                const selectedCountry =
                    countries.find((c) => c.code === value) || null;

                return (
                    <Autocomplete
                        options={countries}
                        getOptionLabel={(option) => option.name}
                        value={selectedCountry}
                        onChange={(_, newValue) => {
                            onChange(newValue ? newValue.code : "");
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={label}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                        disablePortal
                    />
                );
            }}
        />
    );
};

export default NationalityInput;
