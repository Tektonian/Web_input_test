import * as React from "react";
import Textarea from "@mui/joy/Textarea";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import InputfileUpload from "./InputFileUpload";
import Input from "@mui/joy/Input";
import Box from "@mui/joy/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MultiInputTimeRangeField } from "@mui/x-date-pickers-pro/MultiInputTimeRangeField";
import Checkbox from "@mui/joy/Checkbox";
import Sheet from "@mui/joy/Sheet";

export const Request = () => {
    const [text, setText] = React.useState("");
    const maxLength = 50;

    const handleTextChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        if (event.target.value.length <= maxLength) {
            setText(event.target.value);
        }
    };

    return (
        <div>
            <Textarea
                placeholder="제목"
                value={text}
                onChange={handleTextChange}
            ></Textarea>
            <Select defaultValue="인원수">
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5~</Option>
            </Select>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Input type="number" placeholder="급여" />
                <Select defaultValue="통화">
                    <Option value="1">USD</Option>
                    <Option value="2">KRW</Option>
                    <Option value="3">JPY</Option>
                </Select>
            </Box>
            <Textarea
                placeholder="이 일을 하기 위해 어떤 능력이 필요한가요?"
                value={text}
                onChange={handleTextChange}
            ></Textarea>
            <Textarea
                placeholder="업무 내용을 50자 이내로 설명하세요"
                value={text}
                onChange={handleTextChange}
            ></Textarea>
            <Textarea
                placeholder="상세한 업무 내용을 설명하세요"
                minRows={10}
            ></Textarea>
            <Textarea
                placeholder="이 일을 하는 유학생에게 희망사항이 있나요?"
                value={text}
                onChange={handleTextChange}
            ></Textarea>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <DatePicker label="요청일"></DatePicker>

                    <MultiInputTimeRangeField
                        slotProps={{
                            textField: ({ position }) => ({
                                label: position === "start" ? "From" : "To",
                            }),
                        }}
                    />
                </Box>
            </LocalizationProvider>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Input type="text" placeholder="Street Address" />
                <Input type="text" placeholder="City" />
                <Input type="text" placeholder="Prefecture" />
                <Input type="text" placeholder="Postal Code" />
                <Input type="text" placeholder="Country" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Sheet variant="outlined">
                    <Checkbox overlay label="식비 지원" />
                </Sheet>
                <Sheet variant="outlined">
                    <Checkbox overlay label="교통비 지원" />
                </Sheet>
            </Box>
            <Textarea placeholder="당일 필요한 준비물을 알려주세요"></Textarea>
            <InputfileUpload />
        </div>
    );
};
