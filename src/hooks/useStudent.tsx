import React, { useState, useEffect } from "react";
import type { APIType } from "api_spec";

export const useFetchStudentData = () => {
    const [studentData, setStudentData] =
        useState<APIType.StudentType.ResGetStudentProfile | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/corporations/`, {
                    method: "GET",
                });
                const data: APIType.StudentType.ResGetStudentProfile =
                    await response.json();
                setStudentData(data);
            } catch (error) {
                console.error("Error fetching corporation data", error);
            }
        };
        fetchData(); // eslint-disable-line
    }, []);

    return studentData;
};
