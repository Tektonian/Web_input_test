import React from "react";
import {
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/joy";
import { Corporation } from "./components/Corporation";
import { Student } from "./components/Student";
import { Government } from "./components/Government";
import RequestPage from "./Page/RequestPage";
import ProfileSetup from "./Page/ProfileSetup";
import { Consumer } from "./components/Consumer";
import RequestInput from "./Page/RequestInput";
import "./App.css";
import PageStudentProfile from "./Page/PageStudentProfile";
import PageCorpProfile from "./Page/PageCorpProfile";
import PageCorporationReview from "./Page/PageCorporationReview";

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
            <Button
                variant="soft"
                onClick={() => navigate("/corporation-review")}
            >
                CorpReview
            </Button>
        </Box>
    );
};

function App() {
    return (
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
                        path="/student"
                        element={<PageStudentProfile studentId={8} />}
                    />
                    <Route path="/government" element={<Government />} />
                    <Route
                        path="/request"
                        element={<RequestPage request_id={"1"} />}
                    />
                    <Route path="/consumer" element={<Consumer />} />
                    <Route path="/profileinput" element={<ProfileSetup />} />
                    <Route path="/requestinput" element={<RequestInput />} />
                    <Route
                        path="/corporation-review"
                        element={
                            <PageCorporationReview
                                student_id={9}
                                request_id={15}
                            />
                        }
                    />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
