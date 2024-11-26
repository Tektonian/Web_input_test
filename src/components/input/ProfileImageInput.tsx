import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";

interface ProfileImageInputProps {
    control: any;
    onNext: () => void;
    onPrevious: () => void;
}

const defaultImages = [
    "https://i.namu.wiki/i/v1b4uaM-yFnzNvFhk-Zge7CFxautpS8JCJdL16yN86DgHKLLkVLf1iUIhQkuj8qVc02jqurkgFzl6Id41N103x2z2DENixsN8pLYtRd4GJylg5g8aktlin_ye1X-CsYF8alXWZvpIGxfC-TlXnSRa_lvacJ2Y1Eugm7rJOeSd28.webp",
    "https://i.namu.wiki/i/v1b4uaM-yFnzNvFhk-Zge83nkC_wnymdlUAPEJl56LmG0sptyzYvWKjSD9V1QScx7fMXMPWAvc9w5knbjdXWj1RXfXnOWxhhcfqxSMaglilFCJ4uXCu7jJgHSCsE46J5hyvW4RsjSbfm5PktIxHr2RrkGbCiVcmnl439nDAAf4c.webp",
    "https://i.namu.wiki/i/v1b4uaM-yFnzNvFhk-Zgewjoy8VDTUsEm1dw5WQC8HrfEJcLi7y-FqtrSJ-rXDKubq3ewLo0MO7AxTzooJ1BMyxiwBCVZoEhwZbGHKMtOpVfggyGglKtuGVaU9Luwp890RDJE0v0YFvU32g5zbYnMZNi7B_AMwL6Rl_EkMb9M3c.webp",
    "https://i.namu.wiki/i/v1b4uaM-yFnzNvFhk-Zge3-rrGrgydLxw509tVXb9O3dTpxosoDwoFc720uOiXklA3bqTmLIijXIhnuAqkf9x7lSy6fJvAbSRczCx7mx_pUdkbMTyyUXqw9cE-MuuXPJ2pGbCX2i-rI-wB-IFi-LBSAQJb9F-LKw2XF0MAIOVpA.webp",
];

const ProfileImageInput: React.FC<ProfileImageInputProps> = ({
    control,
    onNext,
    onPrevious,
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageDrop = (
        event: React.DragEvent<HTMLDivElement>,
        onChange: (url: string) => void,
    ) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                onChange(result); // 이미지 URL을 폼에 설정
                setPreviewUrl(result); // 미리보기를 위해 설정
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDefaultImageClick = (
        url: string,
        onChange: (url: string) => void,
    ) => {
        onChange(url);
        setPreviewUrl(url);
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Profile Picture
            </Typography>
            <Controller
                name="image"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <Box>
                        <TextField
                            {...field}
                            label="Image URL"
                            fullWidth
                            variant="outlined"
                            onChange={(e) => {
                                field.onChange(e.target.value);
                                setPreviewUrl(e.target.value);
                            }}
                            placeholder="Enter or drop an image URL here"
                        />
                        {/* 드래그 */}
                        <Box
                            onDrop={(event) =>
                                handleImageDrop(event, field.onChange)
                            }
                            onDragOver={(event) => event.preventDefault()}
                            sx={{
                                border: "2px dashed #ccc",
                                padding: 2,
                                marginTop: 2,
                                textAlign: "center",
                                borderRadius: 1,
                                color: "#777",
                                cursor: "pointer",
                            }}
                        >
                            Drag and Drop Image Here
                        </Box>
                        {/* 미리보기 */}
                        {previewUrl && (
                            <Box sx={{ mt: 2, textAlign: "center" }}>
                                <Typography variant="body2">
                                    Image Preview:
                                </Typography>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Box>
                        )}
                        {/* 기본 제공 이미지 */}
                        <Box
                            display="flex"
                            justifyContent="space-around"
                            mt={2}
                        >
                            {defaultImages.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Default ${index + 1}`}
                                    onClick={() =>
                                        handleDefaultImageClick(
                                            url,
                                            field.onChange,
                                        )
                                    }
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        cursor: "pointer",
                                        borderRadius: "4px",
                                        border:
                                            previewUrl === url
                                                ? "2px solid #3f51b5"
                                                : "1px solid #ccc",
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            />
            <button type="button" onClick={onNext}>
                Next
            </button>
            <button type="button" onClick={onPrevious}>
                Previous
            </button>
        </Box>
    );
};

export default ProfileImageInput;
