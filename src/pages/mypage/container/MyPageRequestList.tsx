import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { CorpProfileCard, RequestCard, StudentMyPageCard } from "@mesh/web_component";

import { APIType } from "@mesh/api_spec";
import { useEffect } from "react";

const MyPageRequestList = () => {
    const navigate = useNavigate();
    const { data, isError, isLoading, isSuccess } =
        useQuery<APIType.UserType.ResMyPage>({
            queryKey: ["mypage"],
            queryFn: async () => {
                const res = await fetch(
                    `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/users/mypage`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    },
                );

                return res.json();
            },
        });

    useEffect(() => {
        console.log(data);
    }, [isSuccess]);

    return (
        <>
            <Box sx={{ marginTop: "24px" }}>
                {data?.corp_profile && (
                    <CorpProfileCard
                        onClick={undefined}
                        {...data.corp_profile}
                    />
                )}
            </Box>
            <Box sx={{ marginTop: "24px" }}>
                {data?.student_profile && (
                    // TODO: Fix later
                    // @ts-ignore
                    <StudentMyPageCard {...data.student_profile} />
                )}
            </Box>
            <Box sx={{ marginTop: "24px" }}>
                {data?.user_requests &&
                    data.user_requests.map((request, index) => (
                        <Box key={index} sx={{ marginTop: "16px" }}>
                            <RequestCard
                                {...request}
                                address={request.address ?? ""}
                                request_status={request.request_status ?? 0}
                                onClick={() =>
                                    navigate(
                                        `/student/list/${request.request_id}`,
                                    )
                                }
                            />
                        </Box>
                    ))}
            </Box>
            <Box sx={{ marginTop: "24px" }}>
                {data?.student_requests &&
                    data.student_requests.map((request, index) => (
                        <Box key={index} sx={{ marginTop: "16px" }}>
                            <RequestCard
                                {...request}
                                address={request.address ?? ""}
                                request_status={request.request_status ?? 0}
                                onClick={() =>
                                    navigate(`/request/${request.request_id}`)
                                }
                            />
                        </Box>
                    ))}
            </Box>
        </>
    );
};

export default MyPageRequestList;
