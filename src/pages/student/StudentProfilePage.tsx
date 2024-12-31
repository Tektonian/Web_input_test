import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Tab,
    Tabs,
    Typography,
    Grid2 as Grid,
} from "@mui/material";
import {
    StudentProfileCard,
    StudentIndexCard,
    RequestCard,
    ReviewOfStudentCard,
    AcademicHistoryCard,
} from "web_component";
import { APIType } from "api_spec";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../hooks/Session";

const StudentProfilePage: React.FC = () => {
    const [studentData, setStudentData] =
        useState<APIType.StudentType.ResGetStudentProfile | null>(null);
    const { student_id: student_id } = useParams();
    const navigate = useNavigate();

    const [tabIndex, setTabIndex] = useState(0);

    const { data: session, status } = useSession();
    const roles = session?.user?.roles || [];

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue === 1 && !roles.includes("corp")) {
            alert("기업 유저만 리뷰를 볼 수 있습니다.");
            return; // 다음 행동 정의 필요
        }
        setTabIndex(newValue);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/students/${student_id}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
                const data: APIType.StudentType.ResGetStudentProfile =
                    await response.json();

                console.log("data:", data);

                setStudentData(data);
            } catch (error) {
                console.error("Error fetching student data", error);
            }
        };
        fetchData(); //eslint-disable-line
    }, []);

    const pastRequests = studentData?.requests.filter(
        (req) => req.request_status === 4 || req.request_status === 5,
    );

    const sections = ["0", "1", "2", "3", "4"];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "24px",
                maxWidth: "1080px",
                margin: "auto",
                padding: "16px",
                minHeight: "100vh",
            }}
            id={sections[0]}
        >
            <Container sx={{ width: "712px", padding: "0 !important" }}>
                {studentData && (
                    <StudentProfileCard
                        {...studentData.profile}
                        student_name={JSON.stringify(
                            studentData?.profile.name_glb,
                        )}
                    />
                )}

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
                    <>
                        <Box sx={{ marginTop: "24px" }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                    marginBottom: "16px",
                                }}
                            >
                                학력
                            </Typography>
                            {studentData?.profile.academic_history?.map(
                                (history, index) => (
                                    <Box key={index} sx={{ marginTop: "16px" }}>
                                        <AcademicHistoryCard {...history} />
                                    </Box>
                                ),
                            )}
                        </Box>
                        <Box sx={{ marginTop: "24px" }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                    marginBottom: "16px",
                                }}
                            >
                                과거 요청
                            </Typography>
                            {pastRequests?.map((request, index) => (
                                <Box key={index} sx={{ marginTop: "16px" }}>
                                    <RequestCard
                                        address={request.address ?? ""}
                                        request_status={
                                            request.request_status ?? 4
                                        }
                                        {...request}
                                        renderLogo={true}
                                        onClick={() =>
                                            navigate(
                                                `/request/${request.request_id}`,
                                            )
                                        }
                                    />
                                </Box>
                            ))}
                        </Box>
                    </>
                )}

                {tabIndex === 1 && (
                    <Box sx={{ marginTop: "16px" }}>
                        <Grid container spacing={3}>
                            {studentData?.reviews.map((review, index) => (
                                <Grid size={6} key={index}>
                                    <ReviewOfStudentCard {...review} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>

            <Container
                sx={{
                    width: { xs: "100%", md: "344px" }, // 작은 화면에서는 100% 폭
                    padding: "0 !important",
                    position: { xs: "relative", md: "sticky" }, // 작은 화면에서는 위치 고정 해제
                    top: { md: "50%" }, // 중간 위치 (데스크톱만)
                    transform: { md: "translateY(-50%)" }, // 중간 위치 조정 (데스크톱만)
                    order: { xs: -1, md: 1 }, // 모바일에서 위로 이동
                }}
            >
                <StudentIndexCard sections={sections} />
            </Container>
        </Box>
    );
};

export default StudentProfilePage;
