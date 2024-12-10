import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "./hooks/Session";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Header from "./pages/home/components/Header";
import HomePage from "./pages/home/HomePage";
import PageRequestList from "./pages/Request/PageRequestList";

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
                                element={<PageCorpProfile />}
                            />
                            <Route
                                path="/student/:student_id"
                                element={<PageStudentProfile />}
                            />
                            <Route
                                path="/government"
                                element={<Government />}
                            />
                            <Route
                                path="/request/:request_id"
                                element={<RequestPage />}
                            />
                            <Route
                                path="/request-list"
                                element={<PageRequestList />}
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
