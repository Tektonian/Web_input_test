import { useState, useEffect } from "react";
import Textarea from "@mui/joy/Textarea"
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputfileUpload from './InputFileUpload'
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

const join = (url1: string, url2: string) => {
    return url1 + '/' + url2;
}

export const Corporation = () => {
    const [ bus, setBus ] = useState('')

    // 사업자번호 api key
    const API_KEY = "euH37B5sQyQf%2BJMBs4AeDGQYBNvs2VtOSGnEf0Skr8lsLZIPGl22Ueb9IFA6Xp8k7Snn%2BM0Ta%2BD%2B%2FGVl3Ldt4g%3D%3D";
    const API_BASE_URL = "http://api.odcloud.kr/api"

    const API_VALIDATE_URL = `nts-businessman/v1/validate?serviceKey=${API_KEY}`
    const API_STATUS_URL = `nts-businessman/v1/status?serviceKey=${API_KEY}`
    
    const API_CORP_INFO = `http://apis.data.go.kr/1160100/service/GetCorpBasicInfoService_V2/getCorpOutline_V2`
    // 법인번호 api key
    const CORP_API_KEY = 'euH37B5sQyQf+JMBs4AeDGQYBNvs2VtOSGnEf0Skr8lsLZIPGl22Ueb9IFA6Xp8k7Snn+M0Ta+D+/GVl3Ldt4g=='
    const SAMPLE_CORP_NUM = 1101113892240

    const fetch_status = async (bzno: string) => {
        const res = await fetch(join(API_BASE_URL, API_STATUS_URL), 
                                {
                                    method: "POST",
                                    headers: {
                                        "content-type": "application/json",
                                    },
                                    body: JSON.stringify({"b_no": [bzno]})
                                })
        
        res.json().then((val) => {
            setBus(JSON.stringify(val));
        }).catch((reason) => {
            setBus("errored");
        })
    }
    const example = "https://apis.data.go.kr/1160100/service/GetCorpBasicInfoService_V2/getCorpOutline_V2?serviceKey=euH37B5sQyQf%2BJMBs4AeDGQYBNvs2VtOSGnEf0Skr8lsLZIPGl22Ueb9IFA6Xp8k7Snn%2BM0Ta%2BD%2B%2FGVl3Ldt4g%3D%3D&pageNo=1&numOfRows=10&resultType=json&crno=1101113892240&corpNm=%EB%A9%94%EB%A6%AC%EC%B8%A0%EC%9E%90%EC%82%B0%EC%9A%B4%EC%9A%A9"
    const fetch_corp_info = async () => {
        const res = await fetch(example,
                            {
                                method: "GET",
                            })
        res.json().then((val) => {
            setBus(JSON.stringify(val));
        }).catch((reason) => {
            setBus("errored");
            console.log(reason);
        })
    }
    
    useEffect(()=>{
        fetch_corp_info();
        fetch_status("1078708658")
    }, [])
    

    return (
        <div>
            <Textarea placeholder="법인 등록 번호 (수동 입력)"></Textarea>
            <Textarea placeholder="사업자 번호 (자동 입력)"></Textarea>
            
            <Select defaultValue="국적 (자동)">
                <Option value="Korea">계속 사업자</Option>
                <Option value="Japan">폐업</Option>
                <Option value="USA">휴업자</Option>
            </Select>

            <Textarea placeholder="도메인"></Textarea>
            <Textarea placeholder="폰번호"></Textarea>
            <Textarea placeholder="주소"></Textarea>
            <Textarea placeholder="대표자명"></Textarea>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="사업 시작 날짜" />
            </LocalizationProvider>

            <Select defaultValue="사업자 상태">
                <Option value="계속 사업자">계속 사업자</Option>
                <Option value="폐업자">폐업</Option>
                <Option value="휴업자">휴업자</Option>
            </Select>

            <Textarea placeholder="url (자동 또는 수동)"></Textarea>

            <Textarea placeholder="사업 종류(수동 입력)"></Textarea>
            <InputfileUpload/>
            {bus}
        </div>
    )
}
