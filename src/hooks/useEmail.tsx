import React, { useState, useEffect } from "react";
import { APIType } from "api_spec";

export const handleSendVerificationEmail = async (
    verifyEmail: string,
    userType: string,
) => {
    await fetch("/api/verification/identity-verify", {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // @ts-ignore
            verifyEmail: verifyEmail,
            type: userType,
        }),
    });
};
