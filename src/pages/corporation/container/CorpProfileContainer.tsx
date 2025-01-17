import React, { useState, useEffect } from "react";
import { CorpProfileCard } from "@mesh/web_component";
import type { APIType } from "@mesh/api_spec";

interface CorporationProfileContainerProps {
    corp_id: number;
}

const CorporationProfileContainer: React.FC<
    CorporationProfileContainerProps
> = ({ corp_id }) => {
    const [corpData, setCorporationData] =
        useState<APIType.CorporationType.ResGetCorpProfile | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/corporations/${corp_id}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
                const data: APIType.CorporationType.ResGetCorpProfile =
                    await response.json();
                setCorporationData(data);
            } catch (error) {
                console.error("Error fetching corporation data", error);
            }
        };
        fetchData(); // eslint-disable-line
    }, []);
    return (
        <>{corpData && <CorpProfileCard onClick={undefined} {...corpData} />}</>
    );
};

export default CorporationProfileContainer;
