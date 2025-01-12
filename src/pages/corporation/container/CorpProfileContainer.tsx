import React, { useState, useEffect } from "react";
import { CorpProfileCard } from "web_component";
import type { APIType } from "api_spec";

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
                    `${process.env.REACT_APP_SERVER_BASE_URL}/api/corporations/${corp_id}`,
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
