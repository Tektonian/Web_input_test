import { MyProfileCard } from "web_component";

import { useQuery } from "@tanstack/react-query";
import { APIType } from "api_spec/types";
const MyProfile = () => {
    const { data, isError, isLoading } =
        useQuery<APIType.UserType.ResGetUserData>({
            queryKey: [],
            queryFn: async () => {
                const res = await fetch("http://localhost:8080/api/users", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                return res.json();
            },
        });
    return data === undefined ? (
        <MyProfileCard
            name=""
            image=""
            nationality=""
            workingCountry=""
            location=""
        />
    ) : (
        <MyProfileCard
            name={data.username}
            image={data.image}
            nationality={data.nationality}
            workingCountry={data.working_country}
            location=""
        />
    );
};

export default MyProfile;
