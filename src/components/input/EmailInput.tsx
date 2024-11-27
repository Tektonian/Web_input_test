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

    // TODO: temporary code DELETE later
    const handleNext = () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetch("/api/verification/identity-verify", {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // @ts-ignore
                verifyEmail: innerControl._fields.consumer_email?._f.value,
                type: "student",
            }),
        });
        onNext();
    };

    return (
        <div>
            <h3>Enter Your Email</h3>
            <ShortTextInput
                control={activeControl} // 유효한 control 전달
                name="consumer_email"
                label="Email"
            />
            <button type="button" onClick={handleNext}>
                Next
            </button>
            <button type="button" onClick={onPrevious}>
                Previous
            </button>
        </div>
    );
};

export default EmailInput;
