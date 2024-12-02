import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "./hooks/Session";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/joy";
import { Government } from "./components/Government";
import RequestPage from "./pages/Request/RequestPage";
import ProfileSetup from "./pages/ProfileSetup";
import ChatPage from "./pages/chat/ChatPage";
import { Consumer } from "./components/Consumer";
import RequestInput from "./pages/Request/RequestInput";
import "./App.css";
import PageStudentProfile from "./pages/student/PageStudentProfile";
import PageCorpProfile from "./pages/Corporation/PageCorpProfile";
import PageCorporationReview from "./pages/Corporation/PageCorporationReviewInput";
import StudentListPage from "./pages/student/StudentListPage";
import HomePage from "./pages/home/HomePage";
import UnreadCount from "./components/UnreadCount";

const queryClient = new QueryClient();

// 네비게이션 바 컴포넌트
const NavigationBar = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 4 }}>
            <Button variant="soft" onClick={() => navigate("/corporation")}>
                Corporation
            </Button>
            <Button variant="soft" onClick={() => navigate("/student")}>
                Student
            </Button>
            <Button variant="soft" onClick={() => navigate("/government")}>
                Government
            </Button>
            <Button variant="soft" onClick={() => navigate("/request")}>
                Request
            </Button>
            <Button variant="soft" onClick={() => navigate("/consumer")}>
                Consumer
            </Button>
            <Button variant="soft" onClick={() => navigate("/profileinput")}>
                Profile Input
            </Button>
            <Button variant="soft" onClick={() => navigate("/requestinput")}>
                Request Input
            </Button>
            <UnreadCount onClick={() => navigate("/chat")} />
            <Button
                variant="soft"
                onClick={() => navigate("/corporation-review")}
            >
                CorpReview
            </Button>
            <Button variant="soft" onClick={() => navigate("/home")}>
                Home
            </Button>
            <Button variant="soft" onClick={() => navigate("/student/list")}>
                StudentList
            </Button>
        </Box>
    );
};

function App() {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    {/* 네비게이션 바 */}
                    <NavigationBar />

                    {/* 라우팅 설정 */}
                    <Routes>
                        <Route
                            path="/corporation"
                            element={<PageCorpProfile consumerId={2} />}
                        />
                        <Route
                            path="/student/:student_id"
                            element={<PageStudentProfile />}
                        />
                        <Route path="/government" element={<Government />} />
                        <Route
                            path="/request"
                            element={<RequestPage request_id={"1"} />}
                        />
                        <Route path="/consumer" element={<Consumer />} />
                        <Route
                            path="/profileinput"
                            element={<ProfileSetup />}
                        />
                        <Route
                            path="/requestinput"
                            element={<RequestInput />}
                        />
                        <Route
                            path="/corporation-review"
                            element={
                                <PageCorporationReview
                                    student_id={9}
                                    request_id={15}
                                />
                            }
                        />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route
                            path="/student/list/:request_id"
                            element={<StudentListPage />}
                        />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </SessionProvider>
    );
}

export default App;
