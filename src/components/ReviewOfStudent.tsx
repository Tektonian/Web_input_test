import React from "react";
import {
    Theme,
    Avatar,
    Progress,
    Grid,
    Box,
    Card,
    Flex,
    Text,
    Strong,
    ThemeContext,
} from "@radix-ui/themes";
import RequestCard, { RequestCardProps } from "./RequestCard";
import {
    LightningBoltIcon,
    FaceIcon,
    BackpackIcon,
    LetterCaseToggleIcon,
    RocketIcon,
    PersonIcon,
} from "@radix-ui/react-icons";
import styled from "styled-components";

export interface StudentReviewProps {
    corp_id?: number;
    orgn_id?: number;
    consumer_id: number;
    student_id: number;
    request_id: number;
    request_url: string;
    was_late: number;
    was_proactive: number;
    was_diligent: number;
    commu_ability: number;
    lang_fluent: number;
    goal_fulfillment: number;
    want_cowork: number;
    praise?: string;
    need_improve?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface ReviewOfStudentProps extends StudentReviewProps {
    request_card: RequestCardProps;
}

const lateness = (was_late: number): JSX.Element => {
    switch (was_late) {
        case 1:
            return (
                <Theme>
                    <Text>
                        이 학생은 위 요청에 <Strong>결석</Strong>했어요.
                    </Text>
                </Theme>
            );
        case 2:
            return (
                <Theme>
                    <Text>
                        이 학생은 위 요청에 <Strong>지각</Strong>했어요.
                    </Text>
                </Theme>
            );
        case 3:
            return (
                <Theme>
                    <Text>
                        이 학생은 위 요청에 <Strong>정시출근</Strong>했어요.
                    </Text>
                </Theme>
            );

        default:
            return <Text>Error: Invalid case</Text>;
    }
};

const StyledCard = styled(Card)`
    width: 480px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ReviewOfStudent = ({
    request_card,
    was_late,
    was_proactive,
    was_diligent,
    commu_ability,
    lang_fluent,
    goal_fulfillment,
    want_cowork,
}: ReviewOfStudentProps) => {
    return (
        <StyledCard>
            <Flex direction="column" gap="2" align="stretch" justify="center">
                <Flex direction="column" justify="center">
                    <RequestCard
                        title={request_card.title}
                        subtitle={request_card.subtitle}
                        reward_price={request_card.reward_price}
                        currency={request_card.currency}
                        address={request_card.address}
                        start_date={request_card.start_date}
                        logo_image={request_card.logo_image}
                    />
                </Flex>
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    gap="2"
                >
                    <Text>{lateness(was_late)}</Text>
                    <Grid
                        columns={{ initial: "2", xs: "3" }}
                        gap="4"
                        width="450px"
                    >
                        <Flex
                            direction="row"
                            justify="center"
                            align="center"
                            gap="3"
                        >
                            <Avatar
                                size="3"
                                fallback={<LightningBoltIcon />}
                                highContrast
                                radius="full"
                            />
                            <Progress
                                value={was_proactive * 10}
                                size="3"
                                color="purple"
                            />
                        </Flex>
                        <Flex
                            direction="row"
                            justify="center"
                            align="center"
                            gap="3"
                        >
                            <Avatar
                                size="3"
                                fallback={<BackpackIcon />}
                                highContrast
                                radius="full"
                            />
                            <Progress
                                value={was_diligent * 10}
                                size="3"
                                color="indigo"
                            />
                        </Flex>
                        <Flex
                            direction="row"
                            justify="center"
                            align="center"
                            gap="3"
                        >
                            <Avatar
                                size="3"
                                fallback={<FaceIcon />}
                                highContrast
                                radius="full"
                            />
                            <Progress
                                value={commu_ability * 10}
                                size="3"
                                color="jade"
                            />
                        </Flex>
                        <Flex
                            direction="row"
                            justify="center"
                            align="center"
                            gap="3"
                        >
                            <Avatar
                                size="3"
                                fallback={<LetterCaseToggleIcon />}
                                highContrast
                                radius="full"
                            />
                            <Progress
                                value={lang_fluent * 10}
                                size="3"
                                color="orange"
                            />
                        </Flex>
                        <Flex
                            direction="row"
                            justify="center"
                            align="center"
                            gap="3"
                        >
                            <Avatar
                                size="3"
                                fallback={<RocketIcon />}
                                highContrast
                                radius="full"
                            />
                            <Progress
                                value={goal_fulfillment * 10}
                                size="3"
                                color="amber"
                            />
                        </Flex>
                        <Flex
                            direction="row"
                            justify="center"
                            align="center"
                            gap="3"
                        >
                            <Avatar
                                size="3"
                                fallback={<PersonIcon />}
                                highContrast
                                radius="full"
                            />
                            <Progress
                                value={want_cowork * 10}
                                size="3"
                                color="tomato"
                            />
                        </Flex>
                    </Grid>
                </Flex>
            </Flex>
        </StyledCard>
    );
};

export default ReviewOfStudent;
