import React, { useState, useEffect } from "react";
import { APIType } from "api_spec";

export const useFetchCorpData = () => {
    const [corpData, setCorpData] =
        useState<APIType.CorporationType.ResGetCorpProfile | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/corporations/`, {
                    method: "GET",
                });
                const data: APIType.CorporationType.ResGetCorpProfile =
                    await response.json();
                setCorpData(data);
            } catch (error) {
                console.error("Error fetching corporation data", error);
            }
        };
        fetchData(); // eslint-disable-line
    }, []);

    return corpData;
};