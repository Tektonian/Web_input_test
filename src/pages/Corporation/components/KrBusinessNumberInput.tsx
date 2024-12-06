/* eslint-disable */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ShortTextInput } from "web_component";
import {
    Button,
    Container,
    Typography,
    Box,
    Grid2 as Grid,
} from "@mui/material";

export interface CorporationAttributes {
    corp_name: string;
    nationality: string;
    corp_domain?: string;
    ceo_name?: string;
    corp_address?: string;
    phone_number?: string;
    biz_num: string;
    corp_num?: string;
    biz_started_at?: string;
    corp_status?: number;
    biz_type?: string;
    logo_image?: string;
    site_url?: string;
}

interface KrBusinessNumberInputProps {
    onNext: () => void;
    onPrevious: () => void;
    onCorpIdReceived: (id: number) => void;
}

const KrBusinessNumberInput: React.FC<KrBusinessNumberInputProps> = ({
    onNext,
    onPrevious,
    onCorpIdReceived,
}) => {
    const { control, setValue, getValues } = useForm<CorporationAttributes>({
        defaultValues: {
            corp_name: "",
            nationality: "",
            corp_domain: "",
            ceo_name: "",
            corp_address: "",
            phone_number: "",
            biz_num: "",
            corp_num: "",
            biz_started_at: "",
            corp_status: 0,
            biz_type: "",
            logo_image: "",
            site_url: "",
        },
    });

    const [showCorpProfile, setShowCorpProfile] = useState(false);

    const handleCorporationNumberSubmit = async () => {
        const corpNum = getValues("corp_num");
        if (!corpNum) {
            console.error("Corporation number is required");
            return;
        }

        try {
            const response = await fetch(
                `/api/corporations/corpProfile?corpNum=${corpNum}`,
                {
                    method: "GET",
                },
            );

            if (response.ok) {
                const result = await response.json();
                if (result.status === "exist") {
                    onCorpIdReceived(result.profile.corp_id);
                    onNext();
                } else if (result.status === "not exist") {
                    const profile = result.profile;
                    console.log("Profile data received:", profile);
                    setValue("corp_name", profile.corp_name ?? "");
                    setValue("nationality", profile.nationality ?? "kr");
                    setValue("corp_domain", profile.corp_domain ?? "");
                    setValue("ceo_name", profile.ceo_name ?? "");
                    setValue("corp_address", profile.corp_address ?? "");
                    setValue("phone_number", profile.phone_number ?? "");
                    setValue("biz_num", profile.biz_num ?? "");
                    setValue("corp_num", profile.corp_num ?? "");
                    setValue("biz_started_at", profile.biz_started_at ?? "");
                    setValue("corp_status", profile.corp_status ?? 0);
                    setValue("biz_type", profile.biz_type ?? "");
                    setValue("logo_image", profile.logo_image ?? "");
                    setValue("site_url", profile.site_url ?? "");
                    setShowCorpProfile(true);
                } else {
                    console.error("Unexpected response:", result);
                }
            } else {
                console.error("Failed to fetch corporation profile.");
            }
        } catch (error) {
            console.error("Error fetching corporation profile:", error);
        }
    };

    const handleCorpProfileSubmit = async () => {
        const data = getValues();
        try {
            const response = await fetch("/api/corporations/corpProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                const corpNum = result.corp_num;

                try {
                    const response = await fetch(
                        `/api/corporations/corpProfile?corpNum=${corpNum}`,
                        {
                            method: "GET",
                        },
                    );

                    const result = await response.json();
                    const corpId = result.corp_id;

                    onCorpIdReceived(result.corp_id);
                    onNext();
                } catch (error) {
                    console.error("Error getting corporation info:", error);
                }
            } else {
                console.error("Failed to save corporation profile.");
            }
        } catch (error) {
            console.error("Error saving corporation profile:", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {showCorpProfile
                    ? "Corporate Profile"
                    : "Enter Corporation Number"}
            </Typography>

            <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    {!showCorpProfile ? (
                        <>
                            <Grid size={12}>
                                <ShortTextInput
                                    control={control}
                                    name="corp_num"
                                    label="Corporation Number"
                                />
                            </Grid>

                            <Grid
                                size={12}
                                display="flex"
                                justifyContent="space-between"
                            >
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="secondary"
                                    onClick={onPrevious}
                                >
                                    Previous
                                </Button>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCorporationNumberSubmit}
                                >
                                    Next
                                </Button>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid size={12}>
                                <ShortTextInput
                                    control={control}
                                    name="corp_name"
                                    label="Company Name"
                                />
                            </Grid>
                            <Grid size={12}>
                                <ShortTextInput
                                    control={control}
                                    name="nationality"
                                    label="Nationality"
                                />
                            </Grid>
                            <Grid size={12}>
                                <ShortTextInput
                                    control={control}
                                    name="corp_domain"
                                    label="Corporate Domain"
                                />
                            </Grid>
                            <Grid size={12}>
                                <ShortTextInput
                                    control={control}
                                    name="ceo_name"
                                    label="CEO Name"
                                />
                            </Grid>
                            <Grid size={12}>
                                <ShortTextInput
                                    control={control}
                                    name="corp_address"
                                    label="Corporate Address"
                                />
                            </Grid>
                            <Grid size={12}>
                                <ShortTextInput
                                    control={control}
                                    name="phone_number"
                                    label="Phone Number"
                                />
                            </Grid>
                            <Grid size={12}>
                                <ShortTextInput
                                    control={control}
                                    name="biz_num"
                                    label="Business Number"
                                />
                            </Grid>
                            <Grid size={12}>
                                <ShortTextInput
                                    control={control}
                                    name="biz_started_at"
                                    label="Business Start Date"
                                />
                            </Grid>
                            <Grid size={12}>
                                <ShortTextInput
                                    control={control}
                                    name="biz_type"
                                    label="Business Type"
                                />
                            </Grid>
                            <Grid size={12}>
                                <ShortTextInput
                                    control={control}
                                    name="site_url"
                                    label="Homepage URL"
                                />
                            </Grid>

                            <Grid
                                size={12}
                                display="flex"
                                justifyContent="space-between"
                            >
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="secondary"
                                    onClick={onPrevious}
                                >
                                    Previous
                                </Button>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCorpProfileSubmit}
                                >
                                    Save Profile
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Box>
        </Container>
    );
};

export default KrBusinessNumberInput;
