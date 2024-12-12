import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFunnel } from "../hooks/useFunnel";
import UserTypeInput from "../components/input/UserTypeInput";
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

interface AcademicHistoryCardProps {
    degree: string;
    faculty: string;
    school_name: string;
    start_date: string;
    end_date: string;
    status: "Graduated" | "In Progress" | "Withdrawn";
    logo?: string;
}

export interface LanguageCardProps {
    level: number;
    exam_result: string;
    exam_name: string;
    language: string;
}

interface StudentProfileProps {
    userType: string;
    name_glb: object;
    nationality: string;
    age: string;
    phone_number: string;
    emergency_contact: string;
    email_verified?: Date;
    gender: "남자" | "여지" | "표시하지 않음" | "";
    image: string;
    has_car?: boolean;
    keyword_list?: object;
    academicHistory: AcademicHistoryCardProps[];
    examHistory: LanguageCardProps[];
}
interface ConsumerProfileProps {
    userType: string;
    corp_id?: number | null;
    orgn_id?: number | null;
    consumer_type: string;
    consumer_email: string;
    token: string;
    phone_number: string;
}

type ProfileProps = StudentProfileProps | ConsumerProfileProps;

const ProfileSetup: React.FC = () => {
    const { control, handleSubmit, watch, reset } = useForm<ProfileProps>({
        defaultValues: {
            userType: "",
            image: "",
            nationality: "",
            age: "",
            gender: "",
            academicHistory: [],
            examHistory: [],
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

    const [defaultValues, setDefaultValues] = useState<ProfileProps>({
        userType: "",
        name_glb: {},
        nationality: "",
        age: "",
        phone_number: "",
        emergency_contact: "",
        email_verified: new Date(),
        gender: "",
        image: "",
        has_car: false,
        keyword_list: {},
        academicHistory: [],
        examHistory: [],
    });

    useEffect(() => {
        const getDefaultValues = (): ProfileProps => {
            if (userType === "student") {
                return {
                    userType: "student",
                    name_glb: {},
                    nationality: "",
                    age: "",
                    phone_number: "",
                    emergency_contact: "",
                    email_verified: new Date(),
                    gender: "",
                    image: "",
                    has_car: false,
                    keyword_list: {},
                    academicHistory: [],
                    examHistory: [],
                };
            } else if (userType === "corp") {
                return {
                    userType: "corp",
                    consumer_type: "corp",
                    consumer_email: "",
                    token: "",
                    phone_number: "",
                };
            } else if (userType === "orgn") {
                return {
                    userType: "orgn",
                    consumer_type: "orgn",
                    consumer_email: "",
                    token: "",
                    phone_number: "",
                };
            } else {
                return defaultValues;
            }
        };

        reset(getDefaultValues());
    }, [userType, reset]);

    const onSubmit = async (data: ProfileProps) => {
        let url = "";
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
            url = "/api/verification/callback/identity-verify";

            try {
                const submissionData = corpId
                    ? {
                          type: data.userType,
                          verifyEmail: data.consumer_email,
                          token: data.token,
                          phoneNumber: data.phone_number,
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

                {/* 학생 2: Basic Info 입력 */}
                <Step name="basicInfo">
                    <BasicInfoInput
                        control={control}
                        onNext={() => setStep("academicHistory")}
                        onPrevious={() => setStep("userType")}
                    />
                </Step>

                {/* 학생 3: Academic History 입력 */}
                <Step name="academicHistory">
                    <AcademicHistoryListInput
                        control={control}
                        onNext={() => setStep("examHistory")}
                        onPrevious={() => setStep("basicInfo")}
                    />
                </Step>

                {/* 학생 4: Language History 입력 */}
                <Step name="examHistory">
                    <LanguageHistoryListInput
                        control={control}
                        onNext={() => setStep("image")}
                        onPrevious={() => setStep("academicHistory")}
                    />
                </Step>

                {/* 학생 5: Image URL 입력 */}
                <Step name="image">
                    <ProfileImageInput
                        control={control}
                        onNext={() => setStep("email")}
                        onPrevious={() => setStep("examHistory")}
                    />
                </Step>

                {/* 학생 Step 6: Email 입력 */}
                <Step name="email">
                    <EmailInput
                        control={control}
                        onNext={() => setStep("token")}
                        onPrevious={() => setStep("image")}
                        userType="student"
                    />
                </Step>

                {/* 학생 7: Token 입력 */}
                <Step name="token">
                    <TokenInput
                        control={control}
                        onSubmit={handleSubmit(onSubmit)}
                        onPrevious={() => setStep("email")}
                    />
                </Step>

                {/* 기업 Step 2: Business Number 입력 */}
                <Step name="businessNumber">
                    <KrBusinessNumberInput
                        onCorpIdReceived={handleCorpIdReceived}
                        onNext={() => setStep("consumerInfo")}
                        onPrevious={() => setStep("userType")}
                    />
                </Step>
                {/* 기업 Step 3: Phone Number 입력 */}
                <Step name="consumerInfo">
                    <ConsumerInfoInput
                        control={control}
                        onNext={() => setStep("businessEmail")}
                        onPrevious={() => setStep("businessNumber")}
                    />
                </Step>

                {/* 기업 Step 3: Email 입력 */}
                <Step name="businessEmail">
                    <EmailInput
                        control={control}
                        onNext={() => setStep("businessToken")}
                        onPrevious={() => setStep("businessInfo")}
                        userType="corp"
                    />
                </Step>

                {/* 기업 4: Token 입력 */}
                <Step name="businessToken">
                    <TokenInput
                        control={control}
                        onSubmit={handleSubmit(onSubmit)}
                        onPrevious={() => setStep("businessEmail")}
                    />
                </Step>

                {/* 기관 Step 2: orgn Number 입력 */}
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

                {/* 기관 Step 3: Email 입력 */}
                <Step name="orgnEmail">
                    <EmailInput
                        control={control}
                        onNext={() => setStep("orgnToken")}
                        onPrevious={() => setStep("orgnInfo")}
                        userType="orgn"
                    />
                </Step>

                {/* 기관 4: Token 입력 */}
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
