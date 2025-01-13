import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "./hooks/Session";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequestPage from "./pages/request/RequestPage";
import ProfileSetup from "./pages/ProfileSetup";
import ChatPage from "./pages/chat/ChatPage";
import RequestInput from "./pages/request/RequestInput";
import "./App.css";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import StudentMypage from "./pages/student/StudentMypage";
import CorpMypage from "./pages/corporation/CorpMypage";
import CorpProfilePage from "./pages/corporation/CorpProfilePage";
import StudentListPage from "./pages/student/StudentListPage";
import Header from "./components/Header";
import HomePage from "./pages/home/HomePage";
import RequestListPage from "./pages/request/RequestListPage";
import MyPage from "./pages/mypage/MyPage";
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
                                path="/student/:student_id"
                                element={<StudentProfilePage />}
                            />
                            <Route
                                path="/request/:request_id"
                                element={<RequestPage />}
                            />
                            <Route
                                path="/request/recommend/list"
                                element={<RequestListPage />}
                            />
                            <Route
                                path="/profile/setup"
                                element={<ProfileSetup />}
                            />
                            <Route
                                path="/request/write"
                                element={<RequestInput />}
                            />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/chat" element={<ChatPage />} />
                            <Route
                                path="/student/list/:request_id"
                                element={<StudentListPage />}
                            />
                            <Route path="/mypage" element={<MyPage />} />
                        </Routes>
                    </main>
                </BrowserRouter>
            </QueryClientProvider>
        </SessionProvider>
    );
}

export default App;
