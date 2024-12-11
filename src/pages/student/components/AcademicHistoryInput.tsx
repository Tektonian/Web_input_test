import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { ShortTextInput } from "web_component";
import { YearMonthInput } from "web_component";
import {
    Box,
    Typography,
    Grid2 as Grid,
    TextField,
    MenuItem,
    IconButton,
} from "@mui/material";
import { SelectInput } from "web_component";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

interface AcademicHistoryInputProps {
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

const AcademicHistoryInput: React.FC<AcademicHistoryInputProps> = ({
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
            } catch (error) {
                console.error("Error fetching school data:", error);
            }
        };

        fetchSchools(); // eslint-disable-line
    }, []);

    return (
        <Box
            sx={{
                border: "1px solid #d4d4d4",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#f9f9f9",
                marginBottom: "16px",
            }}
        >
            <Grid container spacing={2} alignItems="center">
                {/* 제목과 Remove 버튼 */}
                <Grid size={11.5}>
                    <Typography variant="h6" gutterBottom>
                        Academic History {index + 1}
                    </Typography>
                </Grid>
                <Grid size={0.5}>
                    <IconButton
                        onClick={onRemove}
                        aria-label="Remove Academic History"
                        sx={{
                            color: "#888",
                        }}
                    >
                        <RemoveCircleOutlineIcon />
                    </IconButton>
                </Grid>

                {/* 입력 필드들 */}
                <Grid size={4}>
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
                <Grid size={4}>
                    <ShortTextInput
                        control={control}
                        name={`academicHistory[${index}].faculty`}
                        label="Faculty"
                    />
                </Grid>
                <Grid size={4}>
                    <SelectInput
                        control={control}
                        name={`academicHistory[${index}].degree`}
                        label="Degree"
                        options={["Bachelor", "Master", "Doctor"]}
                    />
                </Grid>
                <Grid size={4}>
                    <YearMonthInput
                        control={control}
                        name={`academicHistory[${index}].start_date`}
                        label="Start Date"
                    />
                </Grid>
                <Grid size={4}>
                    <YearMonthInput
                        control={control}
                        name={`academicHistory[${index}].end_date`}
                        label="End Date"
                    />
                </Grid>
                <Grid size={4}>
                    <SelectInput
                        control={control}
                        name={`academicHistory[${index}].status`}
                        label="Status"
                        options={["In progress", "Graduated", "Dropout"]}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AcademicHistoryInput;
