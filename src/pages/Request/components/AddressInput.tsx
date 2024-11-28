import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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

const mapContainerStyle = {
    width: "100%",
    height: "300px",
};

const initialCenter = {
    lat: 37.5665,
    lng: 126.978,
};

interface AddressInputProps {
    control: any;
    setValue: any;
}

const AddressInput: React.FC<AddressInputProps> = ({ control, setValue }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
    });

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue: setAutoCompleteValue,
        clearSuggestions,
    } = usePlacesAutocomplete();

    const [mapCenter, setMapCenter] = useState(initialCenter);
    const [markerPosition, setMarkerPosition] = useState(initialCenter);

    const handleSelect = async (address: string) => {
        setValue("address", address);
        setAutoCompleteValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setMapCenter({ lat, lng });
            setMarkerPosition({ lat, lng });

            setValue("address_coordinate", {
                type: "Point",
                coordinates: [lng, lat],
            });
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
    };

    const handleMapClick = async (lat: number, lng: number) => {
        setMarkerPosition({ lat, lng });
        setMapCenter({ lat, lng });

        try {
            const results = await getGeocode({ location: { lat, lng } });
            const address = results[0]?.formatted_address || "";

            setValue("address", address);
            setAutoCompleteValue(address, false);

            setValue("address_coordinate", {
                type: "Point",
                coordinates: [lng, lat],
            });
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <Box>
            <Controller
                name="address"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <>
                        <TextField
                            {...field}
                            fullWidth
                            label="Address"
                            value={value}
                            onChange={(e) => {
                                field.onChange(e);
                                setAutoCompleteValue(e.target.value);
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
                                            onClick={() =>
                                                handleSelect(description)
                                            }
                                        >
                                            <ListItemText
                                                primary={description}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Paper>
                        )}
                    </>
                )}
            />
            <Controller
                name="address_coordinate"
                control={control}
                defaultValue={{
                    type: "Point",
                    coordinates: [0, 0],
                }}
                render={({ field }) => (
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
                )}
            />
        </Box>
    );
};

export default AddressInput;
