import { Button, Select } from "@mui/joy";
import Option from "@mui/joy/Option";
import { useState } from "react";
interface optionProps {
    value: string;
    display: string;
}
interface selectFunnelProps {
    onNext: (userInput: string) => void;
    options: optionProps[];
}

export const SelectFunnel = ({ onNext, options }: selectFunnelProps) => {
    const [selectValue, setSelectValue] = useState("");

    return (
        <form>
            <Select
                defaultValue="kr"
                onChange={(e, val) => {
                    e?.preventDefault();
                    if (val === null) return;
                    setSelectValue(val);
                }}
            >
                {options.map((val, idx) => (
                    <Option value={val.value} id={idx.toString()}>
                        {val.display}
                    </Option>
                ))}
            </Select>
            <Button
                onClick={(e) => {
                    e.preventDefault();
                    onNext(selectValue);
                }}
            >
                Next
            </Button>
        </form>
    );
};
