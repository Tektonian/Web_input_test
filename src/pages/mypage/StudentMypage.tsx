import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { StudentProfileCard, IndexCard, RequestCard } from "web_component";
import { APIType } from "api_spec/dist/esm";
import { useNavigate, useParams } from "react-router-dom";

const StudentMypage = () => {
    const [
        studentData,
        setStudentData,
    ] = useState<APIType.StudentType.ResGetStudentProfile | null>(null);
    const student_id = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`api/students/${student_id}`, {
                    method: "GET",
                });
                const data: APIType.StudentType.ResGetStudentProfile = await response.json();

                console.log(data);

                setStudentData(data);
            } catch (error) {
                console.error("Error fetching student data", error);
            }
        };
    }, []);

    const handleSendingAlarm = () => {};

    const handleRenderReview = () => {};

    const ongoingRequests = studentData?.requests.filter(
        (req) => req.request_status === 3,
    );
    const openRequests = studentData?.requests.filter(
        (req) => req.request_status === 0,
    );
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

                <Box sx={{ marginTop: "24px" }} id={sections[1]}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", marginBottom: "16px" }}
                    >
                        도착 알람을 보내세요!
                    </Typography>
                    {ongoingRequests?.map((request, index) => (
                        <Box key={index} sx={{ marginTop: "16px" }}>
                            <RequestCard
                                {...request}
                                renderLogo={true}
                                onClick={handleSendingAlarm}
                            />
                        </Box>
                    ))}
                </Box>

                <Box sx={{ marginTop: "24px" }} id={sections[4]}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", marginBottom: "16px" }}
                    >
                        신청 요청
                    </Typography>
                    {openRequests?.map((request, index) => (
                        <Box key={index} sx={{ marginTop: "16px" }}>
                            <RequestCard
                                {...request}
                                renderLogo={true}
                                onClick={() =>
                                    navigate(`/request/${request.request_id}`)
                                }
                            />
                        </Box>
                    ))}
                </Box>

                <Box sx={{ marginTop: "24px" }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", marginBottom: "16px" }}
                    >
                        과거 요청
                    </Typography>
                    {pastRequests?.map((request, index) => (
                        <Box key={index} sx={{ marginTop: "16px" }}>
                            <RequestCard
                                {...request}
                                renderLogo={true}
                                onClick={handleRenderReview}
                            />
                        </Box>
                    ))}
                </Box>
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
                <IndexCard roles="student" sections={sections} />
            </Container>
        </Box>
    );
};

export default StudentMypage;
