import { useEffect } from "react";
import dayjs from "dayjs";
import { useCorporation } from "../hooks/useCorporation";
import Textarea from "@mui/joy/Textarea";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputfileUpload from "./InputFileUpload";
import { Button, Input } from "@mui/joy";
import { useFunnel } from "@use-funnel/react-router-dom";
import { OverlayProvider } from "overlay-kit";
/*
참고 자료
1. 사업자 번호 뜻: https://toss.oopy.io/12df081d-1d6b-40d3-b53d-43883f55374e

API 요청
1. 국세청_사업자등록정보 진위확인 및 상태조회 서비스: https://www.data.go.kr/iim/api/selectAPIAcountView.do#/
2. 금융위원회_기업기본정보: https://www.data.go.kr/data/15043184/openapi.do#/
3. 국민연금공단_국민연금 가입 사업장 내역: https://www.data.go.kr/data/3046071/openapi.do#tab_layer_detail_function
*/

/*
요청 flow

1에서 사업자인지 아닌지 validate && 사업자 status 획득가능

법인사업자의 경우 2와 3에서 더 가져올 수 있는 정보 존재 (기업 위치, 기업 명)

그런데 개인사업자의 경우 우리가 얻을 수 있는 정보가 validate에서 의무적으로 넣어야하는 (사업자 번호, 대표자명, 시작 년도)로 한정된다.
*/

export const Corporation = () => {
    const hookCorporation = useCorporation();

    const funnel = useFunnel<{
        국가입력: { nationality?: string };
        법인번호입력: { nationlity: string; corpNum?: string };
        법인정보선택: { nationality: string; corpNum: string; bizNum?: string };

        법인정보입력: {
            nationality: string;
            corpNum: string;
            bizNum: string;
            /*
            corpDomain?: string;
            phoneNumber?: string;
            ceoName?: string;
            bizStartedAt?: string;
            corpSiteUrl?: string;
            */
        };
        /*
        사업자번호인증: {
            nationality: string;
            corpNum: string;
            bizNum: string;
            corpDomain?: string;
            phoneNumber: string;
            ceoName: string;
            bizStartedAt: string;
            corpSiteUrl?: string;
        };
        */
    }>({
        id: "법인등록",
        initial: {
            step: "국가입력",
            context: hookCorporation.corpInfo,
        },
    });

    const sampleBizNum = "1078708658";
    const SAMPLE_CORP_NUM = 1101113892240;

    return (
        <OverlayProvider>
            <funnel.Render
                국가입력={({ history }) => (
                    <Select
                        defaultValue="국적 (자동)"
                        onChange={(e, val) => {
                            e?.preventDefault();
                            if (val === null) return;
                            history
                                .push("법인번호입력", { nationlity: val })
                                .catch(() => 0);
                        }}
                    >
                        <Option value="Korea">한국</Option>
                        <Option value="Japan">일본</Option>
                        <Option value="USA">미국</Option>
                    </Select>
                )}
                법인번호입력={({ context, history }) => (
                    <div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                hookCorporation.mutateCorp.mutate(
                                    hookCorporation.corpInfo.corpNum,
                                );
                            }}
                        >
                            <Input
                                placeholder="법인 번호 입력"
                                onChange={(e) => {
                                    e.preventDefault();
                                    hookCorporation.setCorpNumber(
                                        e.target.value,
                                    );
                                }}
                            ></Input>
                        </form>
                        <Select
                            defaultValue="국적 (자동)"
                            onChange={(e, val) => {
                                e?.preventDefault();
                                if (val === null) return;
                                history
                                    .push("법인정보선택", {
                                        nationality: context.nationlity,
                                        corpNum:
                                            hookCorporation.corpInfo.corpNum,
                                    })
                                    .catch(() => 0);
                            }}
                        >
                            {hookCorporation.recvCorpList.length === 0 ? (
                                <Option value="d">"D"</Option>
                            ) : (
                                hookCorporation.recvCorpList.map((val) => (
                                    <Option value={val.corpNm}>
                                        {val.corpNm + "/" + val.bzno}
                                    </Option>
                                ))
                            )}
                        </Select>
                    </div>
                )}
                법인정보선택={({ context, history }) => (
                    <form>
                        <Textarea
                            value={
                                hookCorporation.corpInfo.bizNum
                                    ? hookCorporation.corpInfo.bizNum
                                    : "사업자 번호 (자동 입력)"
                            }
                        ></Textarea>

                        <Textarea
                            value={
                                hookCorporation.corpInfo.corpDomain
                                    ? hookCorporation.corpInfo.corpDomain
                                    : "도메인"
                            }
                        ></Textarea>
                        <Textarea
                            value={
                                hookCorporation.corpInfo.phoneNumber
                                    ? hookCorporation.corpInfo.phoneNumber
                                    : "폰번호"
                            }
                        ></Textarea>
                        <Textarea
                            value={
                                hookCorporation.corpInfo.corpAddress
                                    ? hookCorporation.corpInfo.corpAddress
                                    : "주소"
                            }
                        ></Textarea>
                        <Textarea
                            value={
                                hookCorporation.corpInfo.ceoName
                                    ? hookCorporation.corpInfo.ceoName
                                    : "대표자명"
                            }
                        ></Textarea>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="사업 시작 날짜"
                                value={
                                    hookCorporation.corpInfo.bizStartedAt
                                        ? dayjs(
                                              hookCorporation.corpInfo
                                                  .bizStartedAt,
                                              "YYYYMMDD",
                                          )
                                        : undefined
                                }
                            />
                        </LocalizationProvider>
                        <Select
                            defaultValue=""
                            value={hookCorporation.corpInfo.status}
                        >
                            <Option value="01">계속 사업자</Option>
                            <Option value="02">휴업자</Option>
                            <Option value="03">폐업</Option>
                        </Select>
                        <Textarea
                            value={
                                hookCorporation.corpInfo.corpDomain === ""
                                    ? hookCorporation.corpInfo.corpDomain
                                    : "url (자동 또는 수동)"
                            }
                        ></Textarea>
                        <Textarea placeholder="사업 종류(수동 입력)">
                            {hookCorporation.corpInfo.bizType}
                        </Textarea>
                        <Button
                            onClick={() =>
                                history.push("법인정보입력", {
                                    ...context,
                                    bizNum: "test",
                                })
                            }
                        >
                            Next
                        </Button>
                    </form>
                )}
                법인정보입력={({ context }) => <div>Complete</div>}
            />

            <InputfileUpload />
        </OverlayProvider>
    );
};
