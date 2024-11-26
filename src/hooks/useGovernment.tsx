import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
interface governProps {
    nationality: string;
    codeNum: string;
    full_name: string;
    short_name?: string;
    email: string;
    phoneNumber: string;
    siteUrl?: string;
    instType?: string;
}

interface receivedGovnInfo {
    org_cd: number; //      Government code
    full_nm: string; //     Institute name
    low_nm: string; //      Institute name in short
    typebig_nm: string; //  Type of institute
    typemid_nm: string; //  Type of institute
}

interface governInfoResponse {
    StanOrgCd: [
        {
            head: [];
        },
        {
            row: receivedGovnInfo[];
        },
    ];
}

export const useGovernment = () => {
    const [governInfo, setGovernInfo] = useState<governProps>({
        nationality: "",
        codeNum: "",
        full_name: "",
        email: "",
        phoneNumber: "",
    });
    const API_KEY =
        "euH37B5sQyQf%2BJMBs4AeDGQYBNvs2VtOSGnEf0Skr8lsLZIPGl22Ueb9IFA6Xp8k7Snn%2BM0Ta%2BD%2B%2FGVl3Ldt4g%3D%3D";
    const BASE_URL =
        "https://apis.data.go.kr/1741000/StanOrgCd2/getStanOrgCdList2";

    const governMutation = useMutation({
        mutationFn: ({
            instId,
            instName,
        }: {
            instId: string;
            instName: string;
        }) => {
            const URL =
                BASE_URL +
                `?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&type=json&full_nm=${encodeURIComponent(
                    instName,
                )}&org_cd=${instId}&stop_selt=0`;
            const res = fetch(URL, {
                method: "GET",
            });
            return res;
        },
        onSuccess: (data, variables, context) => {
            data.json()
                .then((val: governInfoResponse) => {
                    console.log(val);
                    const governInfoList = val.StanOrgCd[1].row;
                    if (governInfoList.length === 0)
                        throw Error("No response exist");
                    setGovernInfo({
                        ...governInfo,
                        codeNum: governInfoList[0].org_cd.toString(),
                        full_name: governInfoList[0].full_nm,
                        instType:
                            "[ " +
                            governInfoList[0].typebig_nm +
                            " / " +
                            governInfoList[0].typemid_nm +
                            " ]",
                    });
                })
                .catch(() => 0);
        },
    });

    return { governInfo, governMutation };
};
