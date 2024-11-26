import React from "react";
import {
    Theme,
    Avatar,
    Box,
    Card,
    Inset,
    Flex,
    Text,
    Link,
} from "@radix-ui/themes";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import styled from "styled-components";

export interface CorpProfileProps {
    corp_id: number;
    corp_name: string;
    nationality: string;
    corp_domain?: string;
    ceo_name?: string;
    corp_address?: string;
    phone_number?: string;
    corp_num: number;
    biz_num?: number;
    biz_started_at?: string;
    status?: string;
    biz_type?: string;
    logo_image?: string;
    site_url?: string;
}

const StyledBox = styled(Box)`
    position: relative;
    left: 40px;
`;

const CorpProfile: React.FC<CorpProfileProps> = ({
    corp_name,
    nationality,
    corp_address,
    biz_type,
    logo_image,
    site_url,
}) => {
    return (
        <Theme>
            <Flex>
                <Box
                    style={{
                        width: "1024px",
                        boxSizing: "border-box",
                        minWidth: "320px",
                    }}
                >
                    <Box>
                        <Inset>
                            <img
                                src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                                alt="Bold typography"
                                style={{
                                    display: "block",
                                    objectFit: "cover",
                                    width: "100%",
                                    height: 140,
                                    backgroundColor: "var(--gray-5)",
                                }}
                            />
                        </Inset>
                        <Flex direction="column" gap="4" align="start">
                            <Flex direction="row" align="center" gap="4">
                                <Avatar
                                    src={logo_image}
                                    size="7"
                                    alt={`${corp_name} logo`}
                                    radius="full"
                                    fallback={"E"}
                                    style={{
                                        position: "relative",
                                        bottom: "40px",
                                        left: "40px",
                                    }}
                                />
                                <StyledBox>
                                    <Text as="div" size="5" weight="bold">
                                        {corp_name}
                                    </Text>
                                    <Text as="p" color="gray" size="2">
                                        {biz_type}
                                    </Text>
                                    <Text as="p" color="gray" size="2">
                                        {nationality}
                                    </Text>
                                </StyledBox>
                            </Flex>
                            <Flex
                                direction={{ initial: "column", xs: "row" }}
                                gap={{ initial: "1", xs: "5" }}
                                style={{ marginTop: "16px" }}
                            >
                                <StyledBox>
                                    <Text
                                        as="p"
                                        size="3"
                                        weight="bold"
                                        color="gray"
                                    >
                                        {corp_address}
                                    </Text>
                                </StyledBox>
                                <StyledBox>
                                    <Link href={site_url} weight="bold">
                                        홈페이지
                                        <ExternalLinkIcon />
                                    </Link>
                                </StyledBox>
                            </Flex>
                        </Flex>
                    </Box>
                </Box>
            </Flex>
        </Theme>
    );
};

export default CorpProfile;
