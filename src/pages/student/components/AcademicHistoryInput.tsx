import "@fontsource/noto-sans-kr";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
    Autocomplete,
    Card,
    CardContent,
    Grid2 as Grid,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { AcademicEnum } from "api_spec/enum";
import React, { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { SelectInput, ShortTextInput, YearMonthInput } from "web_component";
import NationalityInput from "../../../components/input/NationalityInput";

interface AcademicHistoryInputProps {
    control: any;
    index: number;
    onRemove: () => void;
    locale?: "ko" | "us" | "jp" | "";
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
    const [search, setSearch] = useState("");
    const country_code = useWatch({
        control,
        name: `academic_history[${index}].country_code`,
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
                    `${process.env.REACT_APP_SERVER_BASE_URL}/api/search/schools?country_code=${country_code}&q=${search}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
                const data = await response.json();
                console.log("data:", data);
                setSchools(data);
            } catch (error) {
                console.error("Error fetching school data:", error);
            }
        };

        fetchSchools(); // eslint-disable-line
    }, [country_code, search]);

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
                    <Grid size={6}>
                        <NationalityInput
                            control={control}
                            name={`academic_history[${index}].country_code`}
                            label="Country"
                        />
                    </Grid>
                    <Grid size={6}>
                        <Controller
                            name={`academic_history[${index}].school_id`}
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
                                                onChange={(e) => {
                                                    console.log(e);
                                                    setSearch(
                                                        e.target.value ?? "",
                                                    );
                                                }}
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
                    <Grid size={6}>
                        <ShortTextInput
                            control={control}
                            name={`academic_history[${index}].faculty`}
                            label="Faculty"
                        />
                    </Grid>
                    <Grid size={6}>
                        <SelectInput
                            control={control}
                            name={`academic_history[${index}].degree`}
                            options={[
                                {
                                    value: AcademicEnum.ACADEMIC_DEGREE_ENUM
                                        .BACHELOR,
                                    label: "학사",
                                },
                                {
                                    value: AcademicEnum.ACADEMIC_DEGREE_ENUM
                                        .MASTER,
                                    label: "석사",
                                },
                                {
                                    value: AcademicEnum.ACADEMIC_DEGREE_ENUM
                                        .DOCTOR,
                                    label: "박사",
                                },
                            ]}
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
                            name={`academic_history[${index}].start_date`}
                            label="Start Date"
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                        <YearMonthInput
                            control={control}
                            name={`academic_history[${index}].end_date`}
                            label="End Date"
                        />
                    </Grid>
                    <Grid size={4}>
                        <SelectInput
                            control={control}
                            name={`academic_history[${index}].status`}
                            options={[
                                {
                                    value: AcademicEnum.ACADEMIC_STATUS_ENUM
                                        .PROGRESSING,
                                    label: "재학중",
                                },
                                {
                                    value: AcademicEnum.ACADEMIC_STATUS_ENUM
                                        .GRADUATED,
                                    label: "졸업",
                                },
                                {
                                    value: AcademicEnum.ACADEMIC_STATUS_ENUM
                                        .ABSENCE,
                                    label: "휴학",
                                },
                            ]}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default AcademicHistoryInput;
