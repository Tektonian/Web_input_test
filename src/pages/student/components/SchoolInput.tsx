import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { ShortTextInput } from "web_component";
import { YearMonthInput } from "web_component";
import {
    Container,
    Typography,
    Button,
    Grid2 as Grid,
    TextField,
    MenuItem,
} from "@mui/material";
import { SelectInput } from "web_component";

interface SchoolInputProps {
    control: any;
    index: number;
    onRemove: () => void;
    locale?: "kr" | "us" | "jp" | "";
}

interface School {
    school_id: number;
    school_name: string;
    school_name_glb: { [key: string]: string };
}

const SchoolInput: React.FC<SchoolInputProps> = ({
    control,
    index,
    onRemove,
    locale,
}) => {
    const [schools, setSchools] = useState<School[]>([]);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/schools",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
                const data: School[] = await response.json();
                setSchools(data);
                console.log(schools);
            } catch (error) {
                console.error("Error fetching school data:", error);
            }
        };

        fetchSchools(); //eslint-disable-line
    }, []);

    return (
        <Container
            sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 3, my: 2 }}
        >
            <Typography variant="h6" gutterBottom>
                Academic History {index + 1}
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Controller
                        name={`academicHistory[${index}].school_id`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="School Name"
                                fullWidth
                                variant="outlined"
                            >
                                {schools.map((school) => (
                                    <MenuItem
                                        key={school.school_id}
                                        value={school.school_id}
                                    >
                                        {school.school_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <ShortTextInput
                        control={control}
                        name={`academicHistory[${index}].faculty`}
                        label="Faculty"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <SelectInput
                        control={control}
                        name={`academicHistory[${index}].degree`}
                        label="Degree"
                        options={["Bachelor", "Master", "Doctor"]}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <YearMonthInput
                        control={control}
                        name={`academicHistory[${index}].start_date`}
                        label="Start Date"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <YearMonthInput
                        control={control}
                        name={`academicHistory[${index}].end_date`}
                        label="End Date"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <SelectInput
                        control={control}
                        name={`academicHistory[${index}].status`}
                        label="Status"
                        options={["In progress", "Graduated", "Dropout"]}
                    />
                </Grid>
                <Grid
                    size={{ xs: 12, sm: 4 }}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onRemove}
                        sx={{ mt: { xs: 2, sm: 0 } }}
                    >
                        Remove
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SchoolInput;
