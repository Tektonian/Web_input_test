import * as React from "react"
import Textarea from "@mui/joy/Textarea"

export const Consumer = () => {
    return (
        <div>
            <Textarea placeholder="사내 이메일" /> 
            <Textarea placeholder="연락처 (핸드폰)" />
            <Textarea placeholder="이름" />
        </div>
    )
}