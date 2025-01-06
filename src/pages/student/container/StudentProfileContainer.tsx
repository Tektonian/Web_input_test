import React, { useState, useEffect } from "react";
import { StudentProfileCard } from "web_component";
import type { APIType } from "api_spec/types";

interface StudentProfileContainerProps {
    student_id: number;
}

const StudentProfileContainer: React.FC<StudentProfileContainerProps> = ({
    student_id,
}) => {
    const [studentData, setStudentData] =
        useState<APIType.StudentType.ResGetStudentProfile | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/students/${student_id}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
                const data: APIType.StudentType.ResGetStudentProfile =
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
