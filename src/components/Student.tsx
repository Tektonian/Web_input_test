import * as React from "react"
import Textarea from "@mui/joy/Textarea"
import Autocomplete from '@mui/joy/Autocomplete';
import Select from "@mui/joy/Select"
import Input from "@mui/joy/Input"
import Option from "@mui/joy/Option"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import Grid from "@mui/material/Grid2"
export const Student = () => {
    return (
        <div>
            
            <Textarea placeholder="학교 이메일" /> 
            <Textarea placeholder="이름" />
            <Grid container flex="1">
                <Grid size={{ xs: 12, md: 4 }}>
                    학교
                    <Autocomplete options={['Osaka', 'Tokyo']} />;
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    유형
                    <Select defaultValue="학사">
                        <Option value="학사">학사</Option>
                        <Option value="석사">석사</Option>
                        <Option value="박사">박사</Option>
                    </Select>
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                    학부
                    <Autocomplete options={['공학', '문과', '이과', '의료']} />;
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                    전공
                    <Autocomplete options={['컴공', '전자']} />;
                </Grid>                
                <Grid size={{ xs: 12, md: 4 }}>
                    상태 - 재학중인거 하나는 있어야함
                    <Select defaultValue="상태">
                        <Option value="재학">재학</Option>
                        <Option value="휴학">휴학</Option>
                        <Option value="졸업">졸업</Option>
                    </Select>
                </Grid>
            </Grid>            
            <Grid container flex="1">
                <Grid size={{ xs: 12, md: 4 }}>
                    시험
                    <Autocomplete options={['jlpt', 'jpt']} />;
                    <Autocomplete options={['N1', 'N2']} />;
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    채류기간
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Years in descending order"
                        maxDate={dayjs()}
                        openTo="year"
                        views={['year', 'month']}
                        yearsOrder="desc"
                        sx={{ minWidth: 250 }}
                    />
                    <DatePicker
                        label="Years in descending order"
                        maxDate={dayjs()}
                        openTo="year"
                        views={['year', 'month']}
                        yearsOrder="desc"
                        sx={{ minWidth: 250 }}
                    />
                    </LocalizationProvider>
                    </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    비고 (또는 특이사항) - 각 언어별로 적도록 해야함
                    <Input placeholder="컴공 전문용어 마스터"/>
                </Grid>
            </Grid>
        </div>
    )
}