import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Divider,
} from "@mui/material";
import { RequestDataCard, RequestSideCard } from "web_component";
import { useParams } from "react-router-dom";
import { APIType } from "api_spec";
import { useNavigate } from "react-router-dom";

interface RequestDataProps {
    title?: string;
    content?: string;
    are_needed?: string[];
    are_required?: string[];
    address?: string;
    address_coordinate?: {
        lat: number;
        lng: number;
    };
    prep_material?: string[];
    request_status?: number;
    created_at?: Date;
    updated_at?: Date;
}

const RequestPage: React.FC<RequestDataProps> = ({
    title,
    content,
    are_needed,
    are_required,
    address,
    address_coordinate,
    prep_material,
    request_status,
    created_at,
    updated_at,
}) => {
    const googleMapsKey = "AIzaSyB8_1BXxTpvEJHABsLs2EXXNZ1MqS5Kz0c";
    const mapUrl = address_coordinate
        ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${address_coordinate.lat},${address_coordinate.lng}`
        : undefined;

    return (
        <>
            <Typography
                variant="subtitle1"
                sx={{
                    fontFamily: "Noto Sans KR",
                    color: "rgba(0, 0, 0, 0.7)",
                    marginTop: 2,
                    fontSize: "18px",
                }}
            >
                업무 내용
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: "Noto Sans KR",
                    color: "rgba(0, 0, 0, 0.7)",
                    marginBottom: 2,
                    fontSize: "16px",
                    lineHeight: "32px",
                }}
            >
                {content}
            </Typography>
            <Divider />
            <Typography
                variant="subtitle1"
                sx={{
                    fontFamily: "Noto Sans KR",
                    color: "rgba(0, 0, 0, 0.7)",
                    marginTop: 2,
                    fontSize: "18px",
                }}
            >
                요구 사항
            </Typography>
            {are_needed && (
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: "Noto Sans KR",
                        color: "rgba(0, 0, 0, 0.7)",
                        marginBottom: 2,
                        fontSize: "16px",
                        lineHeight: "32px",
                    }}
                >
                    {are_needed.map((item, index) => (
                        <div key={index}>- {item}</div>
                    ))}
                </Typography>
            )}
            <Divider />
            <Typography
                variant="subtitle1"
                sx={{
                    fontFamily: "Noto Sans KR",
                    color: "rgba(0, 0, 0, 0.7)",
                    marginTop: 2,
                    fontSize: "18px",
                }}
            >
                우대 사항
            </Typography>
            {are_required && (
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: "Noto Sans KR",
                        color: "rgba(0, 0, 0, 0.7)",
                        marginBottom: 2,
                        fontSize: "16px",
                        lineHeight: "32px",
                    }}
                >
                    {are_required.map((item, index) => (
                        <div key={index}>- {item}</div>
                    ))}
                </Typography>
            )}
            <Divider />
            <Typography
                variant="subtitle1"
                sx={{
                    fontFamily: "Noto Sans KR",
                    color: "rgba(0, 0, 0, 0.7)",
                    marginTop: 2,
                    fontSize: "18px",
                }}
            >
                준비물
            </Typography>
            {prep_material && (
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: "Noto Sans KR",
                        color: "rgba(0, 0, 0, 0.7)",
                        marginBottom: 2,
                        fontSize: "16px",
                        lineHeight: "32px",
                    }}
                >
                    {prep_material.map((item, index) => (
                        <div key={index}>- {item}</div>
                    ))}
                </Typography>
            )}
            <Divider />
            <Typography
                variant="subtitle1"
                sx={{
                    fontFamily: "Noto Sans KR",
                    color: "rgba(0, 0, 0, 0.7)",
                    marginTop: 2,
                    fontSize: "18px",
                }}
            >
                주소
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: "Noto Sans KR",
                    color: "rgba(0, 0, 0, 0.7)",
                    marginBottom: 2,
                    fontSize: "16px",
                    lineHeight: "32px",
                }}
            >
                {address}
            </Typography>
            <Box sx={{ marginTop: 2 }}>
                <iframe
                    title="google-map"
                    src={mapUrl}
                    style={{
                        width: "100%",
                        height: "450px",
                        border: "none",
                    }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </Box>
        </>
    );
};

export default RequestPage;
