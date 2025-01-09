import React, { useState, useEffect } from "react";
import type { APIType } from "api_spec";

export const handleSendVerificationEmail = async (
    verifyEmail: string,
    userType: string,
) => {
    await fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/verification/identity-verify`,
        {
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
        },
    );
};
