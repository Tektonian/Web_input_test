import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { CorpProfileCard } from "web_component";
import { APIType } from "api_spec";
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
                    `http://localhost:8080/api/corporations/${corp_id}`,
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
                {data && <CorpProfileCard {...data} />}
            </Box>
        </>
    );
};

export default ConsumerContainer;
