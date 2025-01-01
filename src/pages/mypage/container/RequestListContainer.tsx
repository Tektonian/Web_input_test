import React, { useState, useEffect } from "react";
import { RequestListSection } from "../../../components/RequestListSection";
import { APIType } from "api_spec";
import { useNavigate } from "react-router-dom";
import { StudentReviewModal } from "../component/ReviewModal";

const RequestListContainer = () => {
    const [cardsData, setCardsData] =
        useState<APIType.RequestType.ResAllRequestCard>({
            requests: [],
        });
    const [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/requests/list`, {
                    method: "GET",
                    credentials: "include",
                });
                const data: APIType.RequestType.ResAllRequestCard =
                    await response.json();
                setCardsData(data);
            } catch (error) {
                console.error("Error fetching corporation data", error);
            }
        };
        fetchData(); // eslint-disable-line
    }, []);

    const ongoingRequests = cardsData?.requests?.filter(
        (req) => req.request_status === 3,
    );
    const openRequests = cardsData?.requests.filter(
        (req) => req.request_status === 0,
    );
    const pastRequests = cardsData?.requests.filter(
        (req) => req.request_status === 4 || req.request_status === 5,
    );

    const handleSendingAlarm = () => {};

    return (
        <>
            <RequestListSection
                title="진행 중인 요청"
                requests={ongoingRequests}
                onClickRequest={handleSendingAlarm}
            />

            <RequestListSection
                title="신청 요청"
                requests={openRequests}
                onClickRequest={(request) =>
                    navigate(`/request/${request.request_id}`)
                }
            />

            <RequestListSection
                title="과거 요청"
                requests={pastRequests}
                onClickRequest={() => setOpen(true)}
            />
            <StudentReviewModal open={open} setOpen={setOpen} />
        </>
    );
};

export default RequestListContainer;
