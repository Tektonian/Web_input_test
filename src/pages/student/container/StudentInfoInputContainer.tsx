import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { APIType } from "@mesh/api_spec";
import { UserEnum } from "@mesh/api_spec/enum"
import React from "react";
import type { Control } from "react-hook-form";
import { useForm } from "react-hook-form";
import {
    BarNavigationCard,
    StudentInputCard,
    StudentStepperCard,
} from "@mesh/web_component";
import AcademicHistoryListInput from "../components/AcademicHistoryListInput";
import LanguageHistoryListInput from "../components/LanguageHistoryListInput";

interface StudentInfoInputProps {
    onNext: () => void;
    onPrevious: () => void;
}
const StudentInfoInputContainer: React.FC<StudentInfoInputProps> = ({
    onNext,
    onPrevious,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const { control, handleSubmit } =
        useForm<APIType.StudentType.ReqCreateStudentProfile>({
            defaultValues: {
                name_glb: { KO: "", US: "", JP: "" },
                gender: UserEnum.USER_GENDER_ENUM.MALE,
                has_car: UserEnum.USER_GENDER_ENUM.MALE,
                birth_date: "2000-01-01",
                keyword_list: ["", "", ""],
                phone_number: "",
                emergency_contact: "",
                exam_history: [],
                academic_history: [],
            },
        });

    const onSubmit = async (
        studentInfo: APIType.StudentType.ReqCreateStudentProfile,
    ) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/students`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(studentInfo),
                },
            );
            if (response.ok) {
                console.log("Student Data Submitted Successfully");
                onNext();
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "24px",
                    maxWidth: "1080px",
                    padding: "16px",
                    overflow: "hidden",
                    minWidth: "100%",
                    minHeight: "100%",
                    boxSizing: "border-box",
                    margin: "auto",
                }}
            >
                <Container
                    sx={{
                        width: { xs: "100%", md: "712px" },
                        padding: "0 !important",
                    }}
                >
                    <StudentInputCard
                        control={
                            control as Control<APIType.StudentType.ReqCreateStudentProfile> &
                                Control<
                                    Omit<
                                        APIType.StudentType.ReqCreateStudentProfile,
                                        "academic_history" | "exam_history"
                                    >
                                >
                        }
                        // ERROR: Default values are Partial type
                        // TODO: So we have to fix a type of defaultValues
                        // See: https://github.com/react-hook-form/react-hook-form/issues/8510
                        {...(control._defaultValues as Required<
                            Omit<
                                APIType.StudentType.ReqCreateStudentProfile,
                                "academic_history" | "exam_history"
                            >
                        >)}
                    />
                    <AcademicHistoryListInput control={control} />
                    <LanguageHistoryListInput control={control} />
                </Container>

                <Container
                    sx={{
                        width: { xs: "100%", md: "344px" },
                        padding: "0 !important",
                        position: { xs: "relative", md: "sticky" },
                        top: { md: "50%" },
                        transform: { md: "translateY(-50%)" },
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                    }}
                >
                    {!isMobile && <StudentStepperCard currentStep={1} />}
                    <BarNavigationCard
                        onNext={handleSubmit(onSubmit)}
                        onPrevious={onPrevious}
                    />
                </Container>
            </Box>
        </form>
    );
};

export default StudentInfoInputContainer;
