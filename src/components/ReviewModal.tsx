import React from "react";
import { Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import { ReviewOfCorpInput, ReviewOfStudentInput } from "web_component";
import type { APIType } from "api_spec/types";

interface ReviewModalProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export const CorpReviewModal: React.FC<ReviewModalProps> = ({
    open,
    setOpen,
}) => {
    const { control, handleSubmit } =
        useForm<APIType.CorporationReviewType.ReqCreateCorpReview>({
            defaultValues: {
                review_text: "",
                prep_requirement: "",
                work_atmosphere: "",
                sense_of_achive: -1,
            },
        });
    const onSubmit = async (
        data: APIType.CorporationReviewType.ReqCreateCorpReview,
    ) => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/student-reviews",
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                },
            );

            if (response.ok) {
                console.log("Review submitted successfully.");
                setOpen(false);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ReviewOfCorpInput
                control={control}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={() => setOpen(false)}
            />
        </Modal>
    );
};

export const StudentReviewModal: React.FC<ReviewModalProps> = ({
    open,
    setOpen,
}) => {
    const { control, handleSubmit } =
        useForm<APIType.StudentReviewType.ReqCreateStudentReveiw>({
            defaultValues: {
                consumer_id: -1,
                student_id: -1,
                request_id: -1,
                was_late: -1,
                was_proactive: -1,
                was_diligent: -1,
                commu_ability: -1,
                lang_fluent: -1,
                goal_fulfillment: -1,
                want_cowork: -1,
                praise: "",
                need_improve: "",
            },
        });

    const onSubmit = async (
        data: APIType.StudentReviewType.ReqCreateStudentReveiw,
    ) => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/student-reviews",
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                },
            );

            if (response.ok) {
                console.log("Review submitted successfully.");
                setOpen(false);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ReviewOfStudentInput
                control={control}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={() => setOpen(false)}
            />
        </Modal>
    );
};
