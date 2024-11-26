import React from "react";
import { Text, Box, Flex, Avatar } from "@radix-ui/themes";
import styled from "styled-components";
import { RequestProfileProps } from "./RequestProfile";

export interface RequestCardProps {
    title: string;
    subtitle: string;
    reward_price: number;
    currency: "USD" | "KRW" | "JPY" | "";
    address: string;
    start_date: Date;
    logo_image?: string;
}

const ResponsiveBox = styled(Box)`
    display: flex;
    flex-direction: row;
    height: 140px;
    padding: 0px 15px;
    position: relative;
    min-width: 300px;
`;

const ResponsiveAvatar = styled(Avatar)`
    display: block;

    @media (max-width: 480px) {
        display: none;
    }
`;

const TitleText = styled(Text)`
    font-size: 1.2rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 4px;
`;

const SubtitleText = styled(Text)`
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-bottom: 6px;
`;

const RewardText = styled(Text)`
    font-size: 0.8rem;
    font-weight: bold;
    color: #e67e22;
    position: absolute;
    right: 20px;
    bottom: 20px;
`;

const LocationText = styled(Text)`
    font-size: 0.6rem;
    color: #34495e;
`;

const DateText = styled(Text)`
    font-size: 0.6rem;
    color: #7f8c8d;
    position: absolute;
    top: 20px;
    right: 20px;
`;

const RequestCard = ({
    title,
    subtitle,
    reward_price,
    currency,
    address,
    start_date,
    logo_image,
}: RequestCardProps) => (
    <ResponsiveBox>
        <DateText>{start_date.toString()}</DateText>
        <Flex
            direction="row"
            gap="5"
            align="center"
            justify="center"
            style={{ width: "100%", height: "100%" }}
        >
            <ResponsiveAvatar
                size="5"
                src={logo_image}
                radius="medium"
                fallback={title.charAt(0)}
            />
            <Box style={{ flex: 1 }}>
                <Flex direction="column">
                    <TitleText>{title}</TitleText>
                    <SubtitleText>{subtitle}</SubtitleText>
                    <LocationText>{address}</LocationText>
                </Flex>
            </Box>
        </Flex>
        <RewardText>
            {reward_price} {currency}
        </RewardText>
    </ResponsiveBox>
);

export default RequestCard;
