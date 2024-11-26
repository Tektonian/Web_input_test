import React from "react";
import ShortTextInput from "./ShortTextInput";
import { useForm, Controller } from "react-hook-form";

interface EmailInputProps {
    control: any; // 부모 컴포넌트에서 전달받는 control
    onNext: () => void;
    onPrevious: () => void;
    userType: "student" | "corporation" | "government";
}

const EmailInput: React.FC<EmailInputProps> = ({
    control: externalControl,
    onNext,
    onPrevious,
    userType,
}) => {
    // 독립적인 내부 컨트롤러 생성
    const { control: innerControl } = useForm();

    // 선택적으로 외부 또는 내부 control 사용
    const activeControl =
        userType === "student" ? innerControl : externalControl;

    return (
        <div>
            <h3>Enter Your Email</h3>
            <ShortTextInput
                control={activeControl} // 유효한 control 전달
                name="consumer_email"
                label="Email"
            />
            <button type="button" onClick={onNext}>
                Next
            </button>
            <button type="button" onClick={onPrevious}>
                Previous
            </button>
        </div>
    );
};

export default EmailInput;
