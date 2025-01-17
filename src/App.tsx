import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import { useSession } from "./hooks/Session";
import ProfileSetup from "./pages/ProfileSetup";
import ChatPage from "./pages/chat/ChatPage";
import CorpProfilePage from "./pages/corporation/CorpProfilePage";
import HomePage from "./pages/home/HomePage";
import MyPage from "./pages/mypage/MyPage";
import RequestInput from "./pages/request/RequestInput";
import RequestListPage from "./pages/request/RequestListPage";
import RequestPage from "./pages/request/RequestPage";
import StudentListPage from "./pages/student/StudentListPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";

function App() {
    const session = useSession({ required: false });
    console.log(JSON.stringify(session));
    return (
        <BrowserRouter>
            {/** 헤더 */}
            <Header />
            {/** 본문 */}
            <main>
                <Routes>
                    <Route path="/" index element={<HomePage />} />
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
                    <Route path="/profile/setup" element={<ProfileSetup />} />
                    <Route path="/request/write" element={<RequestInput />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route
                        path="/student/list/:request_id"
                        element={<StudentListPage />}
                    />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route
                        path="*"
                        element={
                            session.data === null ? (
                                <Navigate replace to={"/mypage"} />
                            ) : (
                                <Navigate replace to={"/"} />
                            )
                        }
                    />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
