import React from "react";
import { Modal } from "@mui/material";
import { useForm, Control, UseFormHandleSubmit } from "react-hook-form";
import { ReviewOfCorpInput, ReviewOfStudentInput } from "web_component";
import { APIType } from "api_spec";

interface ReviewModalProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    control: Control<any>;
    handleSubmit: UseFormHandleSubmit<APIType.CorpReviewType.ReqCreateCorpReview>;
}

export const CorpReviewModal: React.FC<ReviewModalProps> = ({
    open,
    setOpen,
    control,
    handleSubmit,
}) => {
    const onSubmit = async (
        data: APIType.CorpReviewType.ReqCreateCorpReview,
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
    control,
    handleSubmit,
}) => {
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
