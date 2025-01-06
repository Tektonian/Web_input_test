import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { RequestCard } from "web_component";

import { APIType } from "api_spec/types";

interface Props {
    student_id: number;
}

const StudentRequestListContainer = ({ student_id }: Props) => {
    const navigate = useNavigate();
    const { data, isError, isLoading } =
        useQuery<APIType.RequestType.ResAllRequestCard>({
            queryKey: [student_id],
            queryFn: async () => {
                const res = await fetch(
                    "http://localhost:8080/api/requests/list/student",
                    {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ student_id }),
                    },
                );

                return res.json();
            },
        });

    return (
        <Box sx={{ marginTop: "24px" }}>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    marginBottom: "16px",
                }}
            >
                완료한 요청
            </Typography>
            {data &&
                data.requests.map((request, index) => (
                    <Box key={index} sx={{ marginTop: "16px" }}>
                        <RequestCard
                            {...request}
                            address={request.address ?? ""}
                            request_status={request.request_status ?? 0}
                            renderLogo={false}
                            onClick={() =>
                                navigate(`/request/${request.request_id}`)
                            }
                        />
                    </Box>
                ))}
        </Box>
    );
};

export default StudentRequestListContainer;
