import React, { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { ShortTextInput } from "web_component";
import { YearMonthInput } from "web_component";
import {
    Box,
    Typography,
    Grid2 as Grid,
    TextField,
    IconButton,
    Autocomplete,
    Card,
    CardContent,
} from "@mui/material";
import { SelectInput } from "web_component";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import type { APIType } from "api_spec/types";
import NationalityInput from "../../../components/input/NationalityInput";
import "@fontsource/noto-sans-kr";

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
    country_code: string;
}

const AcademicHistoryInput: React.FC<AcademicHistoryInputProps> = ({
    control,
    index,
    onRemove,
    locale,
}) => {
    const [schools, setSchools] = useState<School[]>([]);
    const country_code = useWatch({
        control,
        name: `academicHistory[${index}].country_code`,
    });

    useEffect(() => {
        const fetchSchools = async () => {
            if (!country_code) {
                setSchools([
                    {
                        school_id: -1,
                        school_name: "국적을 먼저 선택해 주세요",
                        school_name_glb: {},
                        country_code: "xx",
                    },
                ]);
                return;
            }
            try {
                const response = await fetch(
                    `http://localhost:8080/api/search/schools?country_code=${country_code}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
                const data = await response.json();
                console.log("data:", data);
                setSchools(data.ret);
            } catch (error) {
                console.error("Error fetching school data:", error);
            }
        };

        fetchSchools(); // eslint-disable-line
    }, [country_code]);

    return (
        <Card
            sx={{
                border: "1px solid #d3d3d3",
                borderRadius: "16px",
                padding: "24px",
                backgroundColor: "#ffffff",
                marginBottom: "16px",
                fontFamily: "Noto Sans KR",
            }}
        >
            <IconButton
                onClick={onRemove}
                aria-label="Remove Language History"
                sx={{
                    position: "absolute",
                    top: 24,
                    right: 24,
                    color: "#888",
                }}
            >
                <RemoveCircleOutlineIcon />
            </IconButton>
            <CardContent sx={{ padding: "0 !important" }}>
                <Grid container spacing={2} alignItems="center">
                    {/* 제목과 Remove 버튼 */}
                    <Grid size={12}>
                        <Typography variant="h6" gutterBottom>
                            Academic History {index + 1}
                        </Typography>
                    </Grid>

                    {/* 입력 필드들 */}
                    <Grid size={{ xs: 6, md: 2 }}>
                        <NationalityInput
                            control={control}
                            name={`academicHistory[${index}].country_code`}
                            label="Country"
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                        <Controller
                            name={`academicHistory[${index}].school_id`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => {
                                const { onChange, value } = field;
                                const selectedSchool =
                                    schools.find(
                                        (school) => school.school_id === value,
                                    ) || null;

                                return (
                                    <Autocomplete
                                        options={schools}
                                        getOptionLabel={(option) =>
                                            option.school_name
                                        }
                                        value={selectedSchool}
                                        onChange={(_, newValue) => {
                                            onChange(
                                                newValue
                                                    ? newValue.school_id
                                                    : "",
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="School Name"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                        disablePortal
                                    />
                                );
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <ShortTextInput
                            control={control}
                            name={`academicHistory[${index}].faculty`}
                            label="Faculty"
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                        <SelectInput
                            control={control}
                            name={`academicHistory[${index}].degree`}
                            label="Degree"
                            options={["Bachelor", "Master", "Doctor"]}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                        <SelectInput
                            control={control}
                            name={`academicHistory[${index}].status`}
                            label="Status"
                            options={["In progress", "Graduated", "Dropout"]}
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                        <YearMonthInput
                            control={control}
                            name={`academicHistory[${index}].start_date`}
                            label="Start Date"
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                        <YearMonthInput
                            control={control}
                            name={`academicHistory[${index}].end_date`}
                            label="End Date"
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default AcademicHistoryInput;
