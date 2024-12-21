import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFunnel } from "../hooks/useFunnel";
import {
    UserTypeInput,
    EmailTokenInput,
    PageContainer,
    StudentProfileInput,
    StudentStepperCard,
} from "web_component";
import EmailInput from "../components/input/EmailInput";
import TokenInput from "../components/input/TokenInput";
import BasicInfoInput from "./student/components/BasicInfoInput";
import AcademicHistoryListInput from "./student/components/AcademicHistoryListInput";
import LanguageHistoryListInput from "./student/components/LanguageHistoryListInput";
import { ProfileImageInput } from "web_component";
import BusinessNumberInput from "./corporation/components/BusinessNumberInput";
import BusinessInfoInput from "./corporation/components/BusinessInfoInput";
import ConsumerInfoInput from "./corporation/components/ConsumerInfoInput";
import KrBusinessNumberInput from "./corporation/components/KrBusinessNumberInput";
import { useNavigate } from "react-router-dom";

interface AcademicHistoryProps {
    school_id: number;
    degree: string;
    faculty: string;
    school_name: string;
    start_date: string;
    end_date: string;
    status: "Graduated" | "In Progress" | "Withdrawn";
}

export interface ExamProps {
    exam_id: number;
    exam_result: { class: string; level: number };
}

interface VerificationProps {
    userType: "student" | "corp" | "orgn" | "";
    mail_address: string;
    token: string;
}

interface StudentProfileProps extends VerificationProps {
    name_glb: object;
    nationality: string;
    birth_date: Date;
    phone_number: string;
    emergency_contact: string;
    gender: number;
    image: string;
    has_car?: boolean;
    keyword_list?: object;
    academicHistory: AcademicHistoryProps[];
    examHistory: ExamProps[];
}
interface ConsumerProfileProps extends VerificationProps {
    corp_id?: number | null;
    orgn_id?: number | null;
    consumer_type: string;
    phone_number: string;
}

type ProfileProps =
    | VerificationProps
    | StudentProfileProps
    | ConsumerProfileProps;

const ProfileSetup: React.FC = () => {
    const { control, handleSubmit, watch, reset } = useForm<ProfileProps>({
        defaultValues: {
            userType: "",
            mail_address: "",
            token: "",
        },
    });
    const [corpId, setcorpId] = useState<number | null>(null);
    const [orgnId, setorgnId] = useState<number | null>(null);

    const handleCorpIdReceived = (id: number) => {
        setcorpId(id);
        console.log("Received corp_id from child:", id);
    };
    const handleorgnIdReceived = (id: number) => {
        setorgnId(id);
        console.log("Received orgn_id from child:", id);
    };

    const { Funnel, Step, setStep } = useFunnel("userType");
    const userType = watch("userType");
    const navigate = useNavigate();

    useEffect(() => {
        const getDefaultValues = (): ProfileProps => {
            if (userType === "student") {
                return {
                    name_glb: {},
                    nationality: "",
                    birth_date: new Date(),
                    phone_number: "",
                    emergency_contact: "",
                    gender: -1,
                    image: "",
                    has_car: false,
                    keyword_list: {},
                    academicHistory: [],
                    examHistory: [],
                    userType: "",
                    mail_address: "",
                    token: "",
                };
            } else if (userType === "corp") {
                return {
                    corp_id: -1,
                    consumer_type: "corp",
                    phone_number: "",
                    userType: "",
                    mail_address: "",
                    token: "",
                };
            } else if (userType === "orgn") {
                return {
                    orgn_id: -1,
                    consumer_type: "orgn",
                    phone_number: "",
                    userType: "",
                    mail_address: "",
                    token: "",
                };
            } else {
                return {
                    name_glb: {},
                    nationality: "",
                    birth_date: new Date(),
                    phone_number: "",
                    emergency_contact: "",
                    gender: -1,
                    image: "",
                    has_car: false,
                    keyword_list: {},
                    academicHistory: [],
                    examHistory: [],
                    userType: "",
                    mail_address: "",
                    token: "",
                };
            }
        };

        reset(getDefaultValues());
    }, [userType, reset]);

    const onSubmit = async (data: ProfileProps) => {
        const url = "/api/verification/callback/identity-verify";

        console.log(data);
        const isStudentProfile = (
            profile: ProfileProps,
        ): profile is StudentProfileProps => {
            return (profile as StudentProfileProps).examHistory !== undefined;
        };
        if (isStudentProfile(data)) {
            try {
                const studentResponse = await fetch("/api/students/", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                if (studentResponse.ok) {
                    const studentResult = studentResponse.json();
                    console.log(
                        "Student data submitted successfully:",
                        studentResult,
                    );
                    navigate("/home");
                } else {
                    console.error(
                        "Failed to submit student data:",
                        studentResponse.status,
                        await studentResponse.text(),
                    );
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const submissionData = corpId
                    ? {
                          userType: data.userType,
                          verifyEmail: data.mail_address,
                          token: data.token,
                          phoneNumber: data.mail_address,
                          profileId: corpId,
                      }
                    : {
                          ...data,
                          orgn_id: orgnId,
                      };
                console.log("data:", submissionData);
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(submissionData),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("Data successfully submitted:", result);
                    navigate("/home");
                } else {
                    console.error(
                        "Failed to submit data:",
                        response.status,
                        await response.text(),
                    );
                }
            } catch (error) {
                console.error("Error submitting data:", error);
            }
        }
    };

    const onNextStep = () => {
        if (userType === "student") {
            setStep("basicInfo");
        } else if (userType === "corp") {
            setStep("businessNumber");
        } else if (userType === "orgn") {
            setStep("orgnNumber");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Funnel>
                {/* 공통 Step 1: User Type 선택 */}
                <Step name="userType">
                    <UserTypeInput control={control} onNext={onNextStep} />
                </Step>

                {/* 학생 step 시작 */}
                <Step name="basicInfo">
                    <PageContainer
                        main={
                            <StudentProfileInput
                                control={control}
                                onNext={() => setStep("academicHistory")}
                                onPrevious={() => setStep("userType")}
                            />
                        }
                        side={<StudentStepperCard currentStep={1} />}
                    />
                </Step>

                <Step name="academicHistory">
                    <PageContainer
                        main={
                            <AcademicHistoryListInput
                                control={control}
                                onNext={() => setStep("examHistory")}
                                onPrevious={() => setStep("basicInfo")}
                            />
                        }
                        side={<StudentStepperCard currentStep={2} />}
                    />
                </Step>

                <Step name="examHistory">
                    <PageContainer
                        main={
                            <LanguageHistoryListInput
                                control={control}
                                onNext={() => setStep("studentEmail")}
                                onPrevious={() => setStep("academicHistory")}
                            />
                        }
                        side={<StudentStepperCard currentStep={3} />}
                    />
                </Step>

                <Step name="studentEmail">
                    <PageContainer
                        main={
                            <EmailTokenInput
                                control={control}
                                onSend={() => {}}
                                onSubmit={handleSubmit(onSubmit)}
                                onPrevious={() => setStep("examHistory")}
                                userType="student"
                            />
                        }
                        side={<StudentStepperCard currentStep={4} />}
                    />
                </Step>

                {/* 기업 Step 시작 */}
                <Step name="corpNumber">
                    <PageContainer
                        main={
                            <KrBusinessNumberInput
                                onCorpIdReceived={handleCorpIdReceived}
                                onNext={() => setStep("consumerInfo")}
                                onPrevious={() => setStep("userType")}
                            />
                        }
                        side={<StudentStepperCard currentStep={1} />}
                    />
                </Step>

                <Step name="consumerInfo">
                    <PageContainer
                        main={
                            <ConsumerInfoInput
                                control={control}
                                onNext={() => setStep("corpEmail")}
                                onPrevious={() => setStep("corpNumber")}
                            />
                        }
                        side={<StudentStepperCard currentStep={2} />}
                    />
                </Step>

                <Step name="corpEmail">
                    <PageContainer
                        main={
                            <EmailTokenInput
                                control={control}
                                onSend={() => {}}
                                onSubmit={handleSubmit(onSubmit)}
                                onPrevious={() => setStep("consumerInfo")}
                                userType="corp"
                            />
                        }
                        side={<StudentStepperCard currentStep={4} />}
                    />
                </Step>

                {/* 기관 Step 시작 */}
                <Step name="orgnNumber">
                    <BusinessNumberInput
                        control={control}
                        onNext={() => setStep("orgnInfo")}
                        onPrevious={() => setStep("userType")}
                    />
                </Step>

                <Step name="orgnInfo">
                    <BusinessInfoInput
                        control={control}
                        onNext={() => setStep("orgnEmail")}
                        onPrevious={() => setStep("orgnNumber")}
                    />
                </Step>

                <Step name="orgnEmail">
                    <EmailInput
                        control={control}
                        onNext={() => setStep("orgnToken")}
                        onPrevious={() => setStep("orgnInfo")}
                        userType="orgn"
                    />
                </Step>

                <Step name="orgnToken">
                    <TokenInput
                        control={control}
                        onSubmit={handleSubmit(onSubmit)}
                        onPrevious={() => setStep("orgnEmail")}
                    />
                </Step>
            </Funnel>
        </form>
    );
};

export default ProfileSetup;
