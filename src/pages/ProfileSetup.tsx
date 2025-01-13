import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useFunnel } from "../hooks/useFunnel";
import UserTypeInputContainer from "../components/input/UserTypeInputContainer";
import StudentInfoInputContainer from "./student/container/StudentInfoInputContainer";
import CorpInfoInputContainer from "./corporation/container/CorpInfoInputContainer";
import VerificationContainer from "../components/input/VerificationContainer";
import { useNavigate } from "react-router-dom";
import { InfoBoxF } from "@react-google-maps/api";

const ProfileSetup: React.FC = () => {
    const { control, watch, reset } = useForm();
    const { Funnel, Step, setStep } = useFunnel("typeSelect");
    const userType = watch("userType");
    const navigate = useNavigate();

    const onNextStep = () => {
        if (userType === "student") {
            setStep("studentInfo");
        } else if (userType === "corp") {
            setStep("corpInfo");
        } else if (userType === "orgn") {
            setStep("orgnInfo");
        }
    };

    return (
        <Funnel>
            {/* 공통 Step 1: User Type 선택 */}
            <Step name="typeSelect">
                <UserTypeInputContainer control={control} onNext={onNextStep} />
            </Step>

            {/* 학생 step 시작 */}
            <Step name="studentInfo">
                <StudentInfoInputContainer
                    onNext={() => setStep("emailVerification")}
                    onPrevious={() => setStep("typeSelect")}
                />
            </Step>

            {/* 기업 Step 시작 */}
            <Step name="corpInfo">
                <CorpInfoInputContainer
                    onNext={() => setStep("emailVerification")}
                    onPrevious={() => setStep("typeSelect")}
                />
            </Step>

            <Step name="emailVerification">
                <VerificationContainer
                    onNext={() => navigate("/home")}
                    onPrevious={
                        userType === "student"
                            ? () => setStep("studentInfo")
                            : () => setStep("corpInfo")
                    }
                    userType={userType}
                />
            </Step>
        </Funnel>
    );
};

export default ProfileSetup;
