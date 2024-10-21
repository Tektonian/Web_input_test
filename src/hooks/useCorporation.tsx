import { useReducer, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
interface corpInfoProps {
    corpNum: string;
    bizNum?: string;
    nationality?: string;
    corpDomain?: string;
    phoneNumber?: string;
    corpAddress?: string;
    ceoName?: string;
    bizStartedAt?: string;
    status?: string;
    corpSiteUrl?: string;
    bizType?: string;
}

interface receviedCorpInfo {
    bzno: number; //        Business number
    crno: number; //        Corporation number
    corpEnsnNm: string; //  English name of corporation
    corpNm: string; //      Name of corporation
    enpBsadr: string; //    Address of corporation
    enpRprFnm: string; //   CEO name
    enpTlno: string; //     Corporation phone number
    enpEstbDt: string; //   Corporation started at
    enpHmpgUrl?: string; //  Corporation homepage URL
}

interface corpInfoResponse {
    response: {
        body: {
            items: {
                item: [receviedCorpInfo] | [];
            };
            numOfRows: number;
            pageNo: number;
            totalCount: number;
        };
        headers: {
            resultCode: string; // "00" on Success
            resultMsg: string;
        };
    };
}

interface bizStatusResponse {
    status_code: string;
    match_cnt: number;
    request_cnt: number;
    data: receivedBizInfo;
}

interface receivedBizInfo {
    // 01: 계속사업자, 02: 휴업자, 03: 폐업자
    // Should reject 03 (폐업자)
    b_stt: "01" | "02" | "03";
    /*
    01:부가가치세 일반과세자,
    02:부가가치세 간이과세자,
    03:부가가치세 과세특례자,
    04:부가가치세 면세사업자,
    05:수익사업을 영위하지 않는 비영리법인이거나 고유번호가 부여된 단체,국가기관 등,
    06:고유번호가 부여된 단체,
    07:부가가치세 간이과세자(세금계산서 발급사업자),
    * 등록되지 않았거나 삭제된 경우: "국세청에 등록되지 않은 사업자등록번호입니다"
    */
    tax_type: "01" | "02" | "03" | "04" | "05" | "06" | "07";
}

type reducerActionType =
    | { type: "setCorpNum"; corpNum: string }
    | { type: "recvCorpInfo"; data: receviedCorpInfo }
    | { type: "recvBizInfo"; data: receivedBizInfo }
    | { type: "setNationality"; nationality: string };

function corpInfoReducer(
    state: corpInfoProps,
    action: reducerActionType,
): corpInfoProps {
    switch (action.type) {
        case "setCorpNum": {
            return {
                ...state,
                corpNum: action.corpNum,
            };
        }
        case "recvCorpInfo": {
            return {
                ...state,
                bizNum: action.data.bzno.toString(),
                phoneNumber: action.data.enpTlno,
                corpAddress: action.data.enpBsadr,
                ceoName: action.data.enpRprFnm,
                bizStartedAt: action.data.enpEstbDt, // e.g., espEstbDt: 20080203
                corpSiteUrl: action.data.enpHmpgUrl,
            };
        }
        case "recvBizInfo": {
            return {
                ...state,
                bizType: action.data.tax_type,
                status: action.data.b_stt,
            };
        }
        case "setNationality": {
            return {
                ...state,
                nationality: action.nationality,
            };
        }
    }
}

export const useCorporation = () => {
    const initCorpInfo: corpInfoProps = { corpNum: "" };
    const [corpInfo, dispatch] = useReducer(corpInfoReducer, initCorpInfo);
    const [recvCorpList, setRecvCorpList] = useState<receviedCorpInfo[]>([]);
    // 법인 정보
    const mutateCorp = useMutation({
        mutationKey: ["corpNum"],
        mutationFn: (corpNum: string) => {
            const CORP_API_KEY =
                "euH37B5sQyQf+JMBs4AeDGQYBNvs2VtOSGnEf0Skr8lsLZIPGl22Ueb9IFA6Xp8k7Snn+M0Ta+D+/GVl3Ldt4g==";
            const CORP_URL = `https://apis.data.go.kr/1160100/service/GetCorpBasicInfoService_V2/getCorpOutline_V2?serviceKey=${encodeURIComponent(
                CORP_API_KEY,
            )}&pageNo=1&numOfRows=10&resultType=json&crno=${corpNum}`;
            const res = fetch(CORP_URL, {
                method: "GET",
            });
            return res;
        },
        onSuccess: (data, variables, context) => {
            data.json()
                .then((val: corpInfoResponse) => {
                    if (val.response.body.items.item.length === 0)
                        throw Error(
                            `Response got no corporation info
                            Response Code: ${val.response.headers.resultCode}
                            Response Msg: ${val.response.headers.resultMsg}
                            `,
                        );
                    setRecvCorpList(val.response.body.items.item);
                    dispatch({
                        type: "recvCorpInfo",
                        data: val.response.body.items.item[0],
                    });
                })
                .catch((error) => {
                    console.error("Error occured: ", error);
                });
        },
        onError: (error, variables, context) => {
            console.error(error);
        },
    });

    // 사업자 정보
    const mutateBiz = useMutation({
        mutationKey: ["bizNum"],
        mutationFn: (bizNum) => {
            const BIZ_API_KEY =
                "euH37B5sQyQf%2BJMBs4AeDGQYBNvs2VtOSGnEf0Skr8lsLZIPGl22Ueb9IFA6Xp8k7Snn%2BM0Ta%2BD%2B%2FGVl3Ldt4g%3D%3D";
            const BIZ_API_BASE_URL = "http://api.odcloud.kr/api";
            const BIZ_API_VALIDATE_URL = `nts-businessman/v1/validate?serviceKey=${BIZ_API_KEY}`;
            const BIZ_API_STATUS_URL = `nts-businessman/v1/status?serviceKey=${BIZ_API_KEY}`;
            const res = fetch(BIZ_API_BASE_URL + "/" + BIZ_API_VALIDATE_URL, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    businesses: [
                        {
                            b_no: corpInfo.bizNum,
                            p_nm: corpInfo.ceoName,
                            p_nm2: "",
                            b_nm: "",
                            corp_no: "",
                            b_sector: "",
                            b_type: "",
                            start_dt: corpInfo.bizStartedAt,
                        },
                    ],
                }),
            });
            return res;
        },
        onSuccess: (data, variables, context) => {
            data.json()
                .then((val: bizStatusResponse) => {
                    if (val.status_code !== "OK")
                        throw Error(
                            `Response got no corporation info
                            Response Code: ${val.status_code}
                            `,
                        );
                    console.log("Bisuness info", val);
                    dispatch({
                        type: "recvBizInfo",
                        data: val.data,
                    });
                })
                .catch((error) => {
                    console.error("Error occured: ", error);
                });
        },
        onError: (error, variables, context) => {
            console.error(error);
        },
    });

    const setCorpNumber = (corpNum: string) => {
        dispatch({
            type: "setCorpNum",
            corpNum: corpNum,
        });
    };

    const setNationality = (nationality: string) => {
        dispatch({
            type: "setNationality",
            nationality: nationality,
        });
    };

    return {
        corpInfo,
        recvCorpList,
        mutateBiz,
        mutateCorp,
        setCorpNumber,
        setNationality,
    };
};
