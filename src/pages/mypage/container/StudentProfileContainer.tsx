import React, { useState, useEffect } from "react";
import { StudentProfileCard } from "web_component";
import { APIType } from "api_spec";

const StudentProfileContainer = () => {
    const [studentData, setStudentData] =
        useState<APIType.StudentType.ResGetStudentProfile | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/students/`, {
                    method: "GET",
                    credentials: "include",
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
    return (
        <>
            {studentData && (
                <StudentProfileCard
                    {...studentData.profile}
                    student_name={JSON.stringify(studentData?.profile.name_glb)}
                    image={studentData?.profile.image ?? ""}
                    isMypage={true}
                />
            )}
        </>
    );
};

export default StudentProfileContainer;
