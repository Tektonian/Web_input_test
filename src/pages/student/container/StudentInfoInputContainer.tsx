import React from "react";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import {
    StudentProfileInput,
    StudentStepperCard,
    BarNavigationCard,
} from "web_component";
import type { APIType } from "api_spec/types";
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
        useForm<APIType.StudentType.ReqCreateStudentProfile>();

    const onSubmit = async (
        studentInfo: APIType.StudentType.ReqCreateStudentProfile,
    ) => {
        try {
            const response = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(studentInfo),
            });
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
                    width: "100%",
                    height: "100vh",
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
                    <StudentProfileInput control={control} />
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
