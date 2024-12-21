import React from "react";
import { Control, Controller } from "react-hook-form";
import { TextField, Grid2 as Grid, MenuItem } from "@mui/material";

interface GlobalNameInputProps {
    control: Control<any>;
    name: string;
    availableLanguages: string[];
}

const GlobalNameInput: React.FC<GlobalNameInputProps> = ({
    control,
    name,
    availableLanguages,
}) => {
    return (
        <Grid container spacing={2}>
            {[0, 1, 2].map((index) => (
                <Grid size={12} key={index}>
                    <Grid container spacing={2}>
                        <Grid size={3}>
                            <Controller
                                name={`${name}[${index}].language`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label={`Language ${index + 1}`}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        {availableLanguages.map((lang) => (
                                            <MenuItem key={lang} value={lang}>
                                                {lang}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid size={9}>
                            <Controller
                                name={`${name}[${index}].name`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={`Name ${index + 1}`}
                                        fullWidth
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};

export default GlobalNameInput;
