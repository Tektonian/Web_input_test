import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { CorpProfileCard } from "@mesh/web_component";
import type { APIType } from "@mesh/api_spec";
import { useNavigate } from "react-router-dom";

interface ConsumerContainerProps {
    corp_id?: number;
}

const ConsumerContainer: React.FC<ConsumerContainerProps> = (corp_id) => {
    const [data, setData] =
        useState<APIType.CorporationType.ResGetCorpProfile>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/corporations/${corp_id}`,
                    {
                        method: "GET",
                    },
                );
                const data: APIType.CorporationType.ResGetCorpProfile =
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
            <Box sx={{ marginBottom: 4 }}>
                {data && <CorpProfileCard onClick={undefined} {...data} />}
            </Box>
        </>
    );
};

export default ConsumerContainer;
