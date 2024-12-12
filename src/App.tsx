import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "./hooks/Session";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Government } from "./components/Government";
import RequestInfoPage from "./pages/request/RequestInfoPage";
import ProfileSetup from "./pages/ProfileSetup";
import ChatPage from "./pages/chat/ChatPage";
import { Consumer } from "./components/Consumer";
import RequestInput from "./pages/request/RequestInput";
import "./App.css";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import CorpProfilePage from "./pages/corporation/CorpProfilePage";
import PageCorporationReview from "./pages/corporation/CorpReviewInput";
import StudentListPage from "./pages/student/StudentListPage";
import Header from "./pages/home/components/Header";
import HomePage from "./pages/home/HomePage";
import RequestListPage from "./pages/request/RequestListPage";
import CorpReviewInput from "./pages/corporation/CorpReviewInput";
import StudentReviewInput from "./pages/student/StudentReviewInput";

const queryClient = new QueryClient();

function App() {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    {/** 헤더 */}
                    <Header />
                    {/** 본문 */}
                    <main>
                        <Routes>
                            <Route
                                path="/corporation/:corp_id"
                                element={<CorpProfilePage />}
                            />
                            <Route
                                path="/corporationreview/"
                                element={<CorpReviewInput />}
                            />
                            <Route
                                path="/student/:student_id"
                                element={<StudentProfilePage />}
                            />
                            <Route
                                path="/studentreview/"
                                element={<StudentReviewInput />}
                            />
                            <Route
                                path="/government"
                                element={<Government />}
                            />
                            <Route
                                path="/request/:request_id"
                                element={<RequestInfoPage />}
                            />
                            <Route
                                path="/request-list"
                                element={<RequestListPage />}
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
                                path="/corporation-review/:request_id"
                                element={<PageCorporationReview />}
                            />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/chat" element={<ChatPage />} />
                            <Route
                                path="/student/list/:request_id"
                                element={<StudentListPage />}
                            />
                        </Routes>
                    </main>
                </BrowserRouter>
            </QueryClientProvider>
        </SessionProvider>
    );
}

export default App;
