import React, { useState, useEffect } from "react";
import { RequestListSection } from "../../../components/RequestListSection";
import type { APIType } from "@mesh/api_spec";
import { useNavigate } from "react-router-dom";
import { StudentReviewModal } from "../../../components/ReviewModal";

interface RequestListContainerProps {
    student_id?: number;
    corp_id?: number;
    orgn_id?: number;
}

const RequestListContainer: React.FC<RequestListContainerProps> = ({
    student_id,
    corp_id,
    orgn_id,
}) => {
    const [cardsData, setCardsData] =
        useState<APIType.RequestType.ResAllRequestCard>({
            requests: [],
        });
    const [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const body = {
        student_id: student_id,
        corp_id: corp_id,
        orgn_id: orgn_id,
    };

    useEffect(() => {
        const fetchData = async () => {
            console.log(body);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_APP_SERVER_BASE_URL}/api/requests/list`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                    },
                );
                const data: APIType.RequestType.ResAllRequestCard =
                    await response.json();
                console.log("Request Data:", data);
                setCardsData(data);
            } catch (error) {
                console.error("Error fetching request data", error);
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
