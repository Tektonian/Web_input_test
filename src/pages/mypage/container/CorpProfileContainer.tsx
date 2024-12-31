import React, { useState, useEffect } from "react";
import { CorpProfileCard } from "web_component";
import { APIType } from "api_spec";

const CorporationProfileContainer = () => {
    const [corpData, setCorporationData] =
        useState<APIType.CorporationType.ResGetCorpProfile | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/corporations/`, {
                    method: "GET",
                    credentials: "include",
                });
                const data: APIType.CorporationType.ResGetCorpProfile =
                    await response.json();
                setCorporationData(data);
            } catch (error) {
                console.error("Error fetching corporation data", error);
            }
        };
        fetchData(); // eslint-disable-line
    }, []);
    return <>{corpData && <CorpProfileCard {...corpData} isMypage={true} />}</>;
};

export default CorporationProfileContainer;
