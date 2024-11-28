import React from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { TextField, Button, Grid2 as Grid, MenuItem } from "@mui/material";

interface GlobalNameInputProps {
    control: any;
    name: string;
    availableLanguages: string[];
}

const GlobalNameInput: React.FC<GlobalNameInputProps> = ({
    control,
    name,
    availableLanguages,
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    return (
        <Grid container spacing={2}>
            {fields.map((field, index) => (
                <Grid container spacing={2} alignItems="center" key={field.id}>
                    <Grid>
                        <Controller
                            name={`${name}.${index}.language`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Language"
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
                    <Grid>
                        <Controller
                            name={`${name}.${index}.name`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Name"
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>
                    <Grid>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => remove(index)}
                        >
                            Remove
                        </Button>
                    </Grid>
                </Grid>
            ))}
            <Grid>
                <Button
                    variant="contained"
                    onClick={() => append({ language: "", name: "" })}
                >
                    Add Field
                </Button>
            </Grid>
        </Grid>
    );
};

export default GlobalNameInput;
