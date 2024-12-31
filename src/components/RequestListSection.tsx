import React from "react";
import { Box, Typography } from "@mui/material";
import { RequestCard } from "web_component";
import { APIType } from "api_spec";

interface RequestListProps {
    title: string;
    requests: APIType.RequestType.RequestCard[];
    onClickRequest: (request: APIType.RequestType.RequestCard) => void;
}

export const RequestListSection: React.FC<RequestListProps> = ({
    title,
    requests,
    onClickRequest,
}) => (
    <Box sx={{ marginTop: "24px" }}>
        <Typography
            variant="h6"
            sx={{
                fontWeight: "bold",
                marginBottom: "16px",
            }}
        >
            {title}
        </Typography>
        {requests?.map((request, index) => (
            <Box key={index} sx={{ marginTop: "16px" }}>
                <RequestCard
                    {...request}
                    address={request.address ?? ""}
                    request_status={request.request_status ?? 0}
                    renderLogo={false}
                    onClick={() => onClickRequest(request)}
                />
            </Box>
        ))}
    </Box>
);
