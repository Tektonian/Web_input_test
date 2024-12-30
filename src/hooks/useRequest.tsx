import React from "react";
import { APIType } from "api_spec";

export const useFilteredRequests = (
    requests: APIType.RequestType.RequestCard[],
) => {
    return {
        ongoingRequests: requests?.filter((req) => req.request_status === 3),
        openRequests: requests?.filter((req) => req.request_status === 0),
        pastRequests: requests?.filter(
            (req) => req.request_status === 4 || req.request_status === 5,
        ),
    };
};
