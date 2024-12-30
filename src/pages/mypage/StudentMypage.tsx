import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Tab,
    Tabs,
    Typography,
    Grid2 as Grid,
    Modal,
} from "@mui/material";
import {
    StudentProfileCard,
    StudentIndexCard,
    RequestCard,
    ReviewOfStudentCard,
    ReviewOfCorpInput,
} from "web_component";
import { APIType } from "api_spec";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSession } from "src/hooks/Session";
import { useFetchStudentData } from "src/hooks/useStudent";
import { StudentReviewModal } from "./component/ReviewModal";
import { RequestListSection } from "src/components/RequestListSection";
import { useFilteredRequests } from "src/hooks/useRequest";

const StudentMypage = () => {
    const navigate = useNavigate();
    const studentData = useFetchStudentData();
    const { ongoingRequests, openRequests, pastRequests } = useFilteredRequests(
        studentData?.requests || [],
    );
    const [open, setOpen] = React.useState(false);
    const [tabIndex, setTabIndex] = useState(0);

    const { data: session, status } = useSession();
    const name = session?.user?.name || "";

    const { control, handleSubmit } =
        useForm<APIType.CorpReviewType.ReqCreateCorpReview>({
            defaultValues: {
                review_text: "",
                prep_requirement: "",
                work_atmosphere: "",
                sense_of_achive: -1,
            },
        });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleSendingAlarm = () => {};

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
            <Container
                sx={{
                    width: { xs: "100%", md: "712px" },
                    padding: "0 !important",
                }}
            >
                {studentData && (
                    <StudentProfileCard
                        {...studentData.profile}
                        student_name={JSON.stringify(
                            studentData?.profile.name_glb,
                        )}
                        isMypage={true}
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
                        <RequestListSection
                            id={sections[1]}
                            title="진행 중인 요청"
                            requests={ongoingRequests}
                            onClickRequest={() =>
                                alert("ongoing request clicked")
                            }
                        />

                        <RequestListSection
                            id={sections[4]}
                            title="신청 요청"
                            requests={openRequests}
                            onClickRequest={(request) =>
                                navigate(`/request/${request.request_id}`)
                            }
                        />

                        <RequestListSection
                            id={sections[2]}
                            title="과거 요청"
                            requests={pastRequests}
                            onClickRequest={() => setOpen(true)}
                        />
                        <StudentReviewModal
                            open={open}
                            setOpen={setOpen}
                            control={control}
                            handleSubmit={handleSubmit}
                        />
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

export default StudentMypage;
