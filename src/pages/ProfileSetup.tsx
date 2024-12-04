import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFunnel } from "../hooks/useFunnel";
import UserTypeInput from "../components/input/UserTypeInput";
import EmailInput from "../components/input/EmailInput";
import TokenInput from "../components/input/TokenInput";
import BasicInfoInput from "./student/components/BasicInfoInput";
import AcademicHistoryInput from "./student/components/AcademicHistoryInput";
import LanguageHistoryInput from "./student/components/LanguageHistoryInput";
import { ProfileImageInput } from "web_component";
import BusinessNumberInput from "./Corporation/components/BusinessNumberInput";
import BusinessInfoInput from "./Corporation/components/BusinessInfoInput";
import { Buffer } from "buffer";
import ConsumerInfoInput from "./Corporation/components/ConsumerInfoInput";
import KrBusinessNumberInput from "./Corporation/components/KrBusinessNumberInput";

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

    const { Funnel, Step, setStep } = useFunnel("userType");
    const userType = watch("userType");

    const [defaultValues, setDefaultValues] = useState<ProfileProps>({
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
            } else if (userType === "company") {
                return {
                    userType: "company",
                    corp_id: 2,
                    orgn_id: null,
                    consumer_type: "corp",
                    consumer_email: "",
                    token: "",
                    phone_number: "",
                };
            } else if (userType === "government") {
                return {
                    userType: "government",
                    corp_id: null,
                    orgn_id: 3,
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
            url = "/api/consumer/";
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Data successfully submitted:", result);
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
    };

    const onNextStep = () => {
        if (userType === "student") {
            setStep("basicInfo");
        } else if (userType === "company") {
            setStep("businessNumber");
        } else if (userType === "government") {
            setStep("governmentNumber");
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
                    <AcademicHistoryInput
                        control={control}
                        onNext={() => setStep("examHistory")}
                        onPrevious={() => setStep("basicInfo")}
                    />
                </Step>

                {/* 학생 4: Language History 입력 */}
                <Step name="examHistory">
                    <LanguageHistoryInput
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

                {/* 기관 Step 2: Government Number 입력 */}
                <Step name="governmentNumber">
                    <BusinessNumberInput
                        control={control}
                        onNext={() => setStep("governmentInfo")}
                        onPrevious={() => setStep("userType")}
                    />
                </Step>

                <Step name="governmentInfo">
                    <BusinessInfoInput
                        control={control}
                        onNext={() => setStep("governmentEmail")}
                        onPrevious={() => setStep("governmentNumber")}
                    />
                </Step>

                {/* 기관 Step 3: Email 입력 */}
                <Step name="governmentEmail">
                    <EmailInput
                        control={control}
                        onNext={() => setStep("governmentToken")}
                        onPrevious={() => setStep("governmentInfo")}
                        userType="orgn"
                    />
                </Step>

                {/* 기관 4: Token 입력 */}
                <Step name="governmentToken">
                    <TokenInput
                        control={control}
                        onSubmit={handleSubmit(onSubmit)}
                        onPrevious={() => setStep("governmentEmail")}
                    />
                </Step>
            </Funnel>
        </form>
    );
};

export default ProfileSetup;
