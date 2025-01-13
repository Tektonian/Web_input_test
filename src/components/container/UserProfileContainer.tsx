import React, { useState, useEffect } from "react";
import { UserProfileCard } from "web_component";
import type { APIType } from "api_spec/types";
import { useSession } from "../../hooks/Session";

const StudentProfileContainer = () => {
    const [userData, setUserData] =
        useState<APIType.UserType.ResGetUserData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/users`, {
                    method: "GET",
                    credentials: "include",
                });
                const data: APIType.UserType.ResGetUserData =
                    await response.json();
                console.log("User Data:", data);
                setUserData(data);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
        fetchData(); // eslint-disable-line
    }, []);
    return <>{userData && <UserProfileCard {...userData} image="" />}</>;
};

export default StudentProfileContainer;
