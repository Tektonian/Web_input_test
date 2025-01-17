import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { RequestCard } from "@mesh/web_component";
import type { APIType } from "@mesh/api_spec";
import { useNavigate } from "react-router-dom";

interface OtherRequestContainerProps {
    corp_id?: number;
    orgn_id?: number;
}

const OtherRequestContainer: React.FC<OtherRequestContainerProps> = (
    corp_id,
    orgn_id,
) => {
    const navigate = useNavigate();
    const [data, setData] = useState<APIType.RequestType.ResAllRequestCard>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${
                        import.meta.env.VITE_APP_SERVER_BASE_URL
                    }/api/requests/list/${corp_id ?? orgn_id}`,
                    {
                        method: "GET",
                    },
                );
                const data: APIType.RequestType.ResAllRequestCard =
                    await response.json();

                console.log("data:", data);

                setData(data);
            } catch (error) {
                console.error("Error fetching request data:", error);
            }
        };
        fetchData(); //eslint-disable-line
    }, []);
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                }}
            >
                {data?.requests.map((request, index) => (
                    <Box key={index} sx={{ width: "100%" }}>
                        <RequestCard
                            key={index}
                            {...request}
                            address={request.address ?? ""}
                            request_status={request.request_status ?? 4}
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

export default OtherRequestContainer;
