import React from "react";
import {
    Theme,
    Progress,
    Box,
    Card,
    Flex,
    Text,
    Inset,
    Strong,
} from "@radix-ui/themes";
import RequestCard, { RequestCardProps } from "./RequestCard";
import { StarIcon } from "@radix-ui/react-icons";

export interface CorporationReviewProps {
    consumer_id: number;
    student_id: number;
    corp_id: number;
    reqeust_id: number;
    request_url: string;
    review_text?: string;
    prep_requirement?: string;
    work_atmosphere?: string;
    sense_of_achive: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface ReviewOfCorpProps extends CorporationReviewProps {
    request_card: RequestCardProps;
}

const ReviewOfCorp: React.FC<ReviewOfCorpProps> = ({
    request_card,
    review_text,
    prep_requirement,
    work_atmosphere,
    sense_of_achive,
}) => {
    return (
        <Theme>
            <Box width={{ initial: "300px", xs: "480px" }}>
                <Card>
                    <Flex
                        direction="column"
                        gap="2"
                        align="stretch"
                        justify="center"
                    >
                        <Inset>
                            <RequestCard
                                title={request_card.title}
                                subtitle={request_card.subtitle}
                                reward_price={0}
                                currency=""
                                address={request_card.address}
                                start_date={new Date()}
                                logo_image={request_card.logo_image}
                            />
                        </Inset>
                        <Text as="p" size="4" style={{ marginTop: "16px" }}>
                            <Strong>Review: </Strong>
                            {review_text}
                        </Text>
                        <Text as="p" size="4" style={{ marginTop: "8px" }}>
                            <Strong>Preparation Required: </Strong>
                            {prep_requirement}
                        </Text>
                        <Text as="p" size="4" style={{ marginTop: "8px" }}>
                            <Strong>Work Atmosphere: </Strong>
                            {work_atmosphere}
                        </Text>
                        <Box>
                            <Flex
                                align="center"
                                justify="center"
                                direction="column"
                                gap="2"
                            >
                                <StarIcon />
                                <Progress
                                    value={sense_of_achive * 10}
                                    style={{ width: "100%" }}
                                />
                            </Flex>
                        </Box>
                    </Flex>
                </Card>
            </Box>
        </Theme>
    );
};

export default ReviewOfCorp;
