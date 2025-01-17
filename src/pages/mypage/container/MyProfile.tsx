import { MyProfileCard } from "@mesh/web_component";

import { useQuery } from "@tanstack/react-query";
import { APIType } from "@mesh/api_spec";
const MyProfile = () => {
    const { data, isError, isLoading } =
        useQuery<APIType.UserType.ResGetUserData>({
            queryKey: [],
            queryFn: async () => {
                const res = await fetch(
                    `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/users`,
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
