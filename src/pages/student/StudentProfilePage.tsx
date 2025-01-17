import React, { useState } from "react";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { StudentIndexCard } from "@mesh/web_component";
import StudentProfileContainer from "./container/StudentProfileContainer";
import StudentRequestListContainer from "./container/StudentRequestLIstContainer";
import StudentReviewContainer from "./container/StudentReviewContainer";
import { useParams } from "react-router-dom";

const StudentProfilePage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const { student_id: student_id } = useParams();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const sections = ["0", "1", "2", "3", "4"];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: {
                    xs: "column",
                    md: "row",
                },
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "24px",
                maxWidth: "1080px",
                margin: "auto",
                padding: "16px",
                minHeight: "100%",
            }}
            id={sections[0]}
        >
            <Container
                sx={{
                    width: { xs: "100%", md: "712px" },
                    padding: "0 !important",
                }}
            >
                <StudentProfileContainer student_id={Number(student_id)} />

                <Box sx={{ marginTop: "24px" }}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        centered
                        variant="fullWidth"
                    >
                        <Tab label="의뢰" />
                        <Tab label="리뷰" />
                    </Tabs>
                </Box>

                {tabIndex === 0 && (
                    <StudentRequestListContainer
                        student_id={Number(student_id)}
                    />
                )}
                {tabIndex === 1 && (
                    <StudentReviewContainer student_id={Number(student_id)} />
                )}
            </Container>

            <Container
                sx={{
                    width: { xs: "100%", md: "344px" },
                    padding: "0 !important",
                    position: { xs: "relative", md: "sticky" },
                    top: { md: "50%" },
                    transform: { md: "translateY(-50%)" },
                    order: { xs: -1, md: 1 },
                }}
            >
                <StudentIndexCard sections={sections} />
            </Container>
        </Box>
    );
};

export default StudentProfilePage;
