import * as React from "react"
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import InputfileUpload from './InputFileUpload'

export const Request = () => {
    return (
    <div>
        인원수
        <Select defaultValue="1">
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        </Select>
        <InputfileUpload/>
    </div>
    )

}