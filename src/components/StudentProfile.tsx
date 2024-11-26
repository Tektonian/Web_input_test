import React from "react";
import {
    Theme,
    Grid,
    Avatar,
    Box,
    Flex,
    Text,
    Separator,
    Inset,
} from "@radix-ui/themes";
import AcademicHistoryCard, {
    AcademicHistoryCardProps,
} from "./AcademicHistoryCard";
import LanguageCard, { LanguageCardProps } from "./LanguageCard";

export interface StudentProfileProps {
    student_id: number;
    user_id: Buffer | Uint8Array;
    name_glb: { [key: string]: string };
    nationality: string;
    age: string;
    phone_number: string;
    emergency_contact: string;
    email_verified?: Date;
    gender: "남자" | "여지" | "표시하지 않음" | "";
    image: string;
    has_car?: boolean;
    keyword_list?: object;
    created_at?: Date;
    updated_at?: Date;
    academic: AcademicHistoryCardProps[] | null;
    language: LanguageCardProps[] | null;
}

const StudentProfile: React.FC<StudentProfileProps> = ({
    student_id,
    user_id,
    name_glb,
    nationality,
    age,
    phone_number,
    emergency_contact,
    email_verified,
    gender,
    image,
    has_car,
    keyword_list,
    created_at,
    updated_at,
    academic,
    language,
}) => {
    return (
        <Theme>
            <Flex align="center" justify="center">
                <Box
                    width={{ xs: "520px", sm: "768px", md: "1024px" }}
                    minWidth="300px"
                >
                    <Box>
                        <Inset>
                            <img
                                src={
                                    "https://upload.wikimedia.org/wikipedia/commons/e/e1/Thermopylae_ancient_coastline_large.jpg"
                                }
                                alt="past_activities"
                                style={{
                                    display: "block",
                                    width: "100%",
                                    height: "280px",
                                    backgroundColor: "var(--gray-5)",
                                    objectFit: "cover",
                                }}
                            />
                        </Inset>
                        <Flex direction="column" gap="4" align="start">
                            <Flex direction="row" align="center" gap="4">
                                <Box
                                    style={{
                                        position: "relative",
                                        bottom: "40px",
                                        left: "40px",
                                    }}
                                >
                                    <Avatar
                                        src={image}
                                        size="7"
                                        alt={`${name_glb.kr} logo`}
                                        radius="full"
                                        fallback={name_glb.kr?.charAt(0)}
                                    />
                                </Box>
                                <Box
                                    style={{
                                        position: "relative",
                                        left: "40px",
                                    }}
                                >
                                    <Text as="div" size="5" weight="bold">
                                        {name_glb.kr ||
                                            name_glb.en ||
                                            "Unknown Name"}
                                    </Text>
                                    <Text as="p" color="gray" size="2">
                                        {nationality}, {gender}, {age}
                                    </Text>
                                </Box>
                            </Flex>
                        </Flex>
                    </Box>
                    <Separator my="3" size="4" />
                    <Text as="div" size="6" weight="bold">
                        Academic History
                    </Text>
                    <Box style={{ padding: "16px" }}>
                        <Grid
                            columns={{ initial: "1", md: "2" }}
                            gap="3"
                            rows="auto"
                            width="auto"
                        >
                            {academic && academic.length > 0 ? (
                                academic.map((history, index) => (
                                    <Flex
                                        key={index}
                                        justify="center"
                                        align="center"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        <AcademicHistoryCard
                                            degree={history.degree}
                                            faculty={history.faculty}
                                            school_name={history.school_name}
                                            start_date={history.start_date}
                                            end_date={history.end_date}
                                            status={history.status}
                                            logo={history.logo}
                                        />
                                    </Flex>
                                ))
                            ) : (
                                <Text as="div" color="gray" size="3">
                                    No academic history available.
                                </Text>
                            )}
                        </Grid>
                    </Box>
                    <Separator my="3" size="4" />
                    <Text as="div" size="6" weight="bold">
                        Language Proficiency
                    </Text>
                    <Box style={{ padding: "16px" }}>
                        <Grid
                            columns={{
                                initial: "1",
                                xs: "2",
                                sm: "3",
                                md: "6",
                            }}
                            gap="3"
                            rows="auto"
                        >
                            {language && language.length > 0 ? (
                                language.map((history, index) => (
                                    <Flex
                                        key={index}
                                        justify="center"
                                        align="center"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        <LanguageCard
                                            level={history.level}
                                            exam_result={history.exam_result}
                                            exam_name={history.exam_name}
                                            language={history.language}
                                        />
                                    </Flex>
                                ))
                            ) : (
                                <Text as="div" color="gray" size="3">
                                    No language proficiency information
                                    available.
                                </Text>
                            )}
                        </Grid>
                    </Box>
                </Box>
            </Flex>
        </Theme>
    );
};

export default StudentProfile;
