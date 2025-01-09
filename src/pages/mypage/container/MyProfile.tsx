import { MyProfileCard } from "web_component";

import { useQuery } from "@tanstack/react-query";
import { APIType } from "api_spec";
const MyProfile = () => {
    const { data, isError, isLoading } =
        useQuery<APIType.UserType.ResGetUserData>({
            queryKey: [],
            queryFn: async () => {
                const res = await fetch(
                    `${process.env.REACT_APP_SERVER_BASE_URL}/api/users`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    },
                );

                return res.json();
            },
        });
    return data === undefined ? (
        <MyProfileCard username="" image="" location="" />
    ) : (
        <MyProfileCard
            username={data.username}
            image={data.image}
            nationality={data.nationality}
            working_country={data.working_country}
            location=""
        />
    );
};

export default MyProfile;
