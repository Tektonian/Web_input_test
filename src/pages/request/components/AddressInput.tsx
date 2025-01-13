import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    TextField,
    Box,
    List,
    ListItemButton,
    ListItemText,
    Paper,
} from "@mui/material";
import { useFormContext } from "react-hook-form";

const mapContainerStyle = {
    width: "100%",
    height: "300px",
};

const initialCenter = {
    lat: 37.5665,
    lng: 126.978,
};

const AddressInput: React.FC = () => {
    // 상위 <FormProvider>로부터 useFormContext()를 통해 register, setValue, watch 등을 가져옴
    const { register, setValue, watch } = useFormContext();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
    });

    // Places Autocomplete 훅
    const {
        ready,
        value: autoCompleteVal,
        suggestions: { status, data },
        setValue: setAutoCompleteValue,
        clearSuggestions,
    } = usePlacesAutocomplete();

    const [mapCenter, setMapCenter] = useState(initialCenter);
    const [markerPosition, setMarkerPosition] = useState(initialCenter);

    const addressWatch = watch("address", "");

    useEffect(() => {
        setAutoCompleteValue(addressWatch, false);
    }, [addressWatch, setAutoCompleteValue]);

    // 자동완성 리스트 중 하나를 선택했을 때
    const handleSelect = async (address: string) => {
        setValue("address", address);
        setAutoCompleteValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setMapCenter({ lat, lng });
            setMarkerPosition({ lat, lng });

            setValue("data.address_coordinate.lat", lat);
            setValue("data.address_coordinate.lng", lng);
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
    };

    const handleMapClick = async (lat: number, lng: number) => {
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });

        try {
            const results = await getGeocode({ location: { lat, lng } });
            const address = results[0]?.formatted_address || "";

            setValue("address", address);
            setAutoCompleteValue(address, false);

            setValue("data.address_coordinate.lat", lat);
            setValue("data.address_coordinate.lng", lng);
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <Box>
            {/* 주소 TextField */}
            <TextField
                label="Address"
                fullWidth
                value={autoCompleteVal}
                onChange={(e) => {
                    setAutoCompleteValue(e.target.value);
                    setValue("address", e.target.value);
                }}
                disabled={!ready}
            />
            {status === "OK" && (
                <Paper
                    elevation={3}
                    sx={{
                        maxHeight: 200,
                        overflowY: "auto",
                        marginTop: 1,
                    }}
                >
                    <List>
                        {data.map(({ place_id, description }) => (
                            <ListItemButton
                                key={place_id}
                                onClick={() => handleSelect(description)}
                            >
                                <ListItemText primary={description} />
                            </ListItemButton>
                        ))}
                    </List>
                </Paper>
            )}

            {/* data.address_coordinate: { lat, lng }를 각각 hidden input으로 register */}
            <input
                type="hidden"
                {...register("data.address_coordinate.lat", {
                    valueAsNumber: true,
                })}
            />
            <input
                type="hidden"
                {...register("data.address_coordinate.lng", {
                    valueAsNumber: true,
                })}
            />

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={15}
                onClick={(e) => {
                    const lat = e.latLng?.lat() || 0;
                    const lng = e.latLng?.lng() || 0;
                    handleMapClick(lat, lng); //eslint-disable-line
                }}
            >
                <Marker position={markerPosition} />
            </GoogleMap>
        </Box>
    );
};

export default AddressInput;
