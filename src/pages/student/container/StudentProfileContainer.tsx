import React, { useState, useEffect } from "react";
import { StudentProfileCard } from "web_component";
import type { APIType } from "api_spec";

interface StudentProfileContainerProps {
    student_id: number;
}

const StudentProfileContainer: React.FC<StudentProfileContainerProps> = ({
    student_id,
}) => {
    const [studentData, setStudentData] =
        useState<APIType.StudentType.ResGetStudentProfile<false> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_SERVER_BASE_URL}/api/students/${student_id}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
                const data: APIType.StudentType.ResGetStudentProfile<false> =
                    await response.json();
                console.log("Student Data:", data);
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
                    {...studentData}
                    // image={studentData?.image ?? ""}
                />
            )}
        </>
    );
};

export default StudentProfileContainer;
