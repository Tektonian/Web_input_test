import React from "react";
import GlobalNameInput from "./GlobalNameInput";
import { DateInput, ShortTextInput } from "web_component";
import {
    Box,
    Container,
    Button,
    Typography,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Grid2 as Grid,
} from "@mui/material";
import { NavigationButton } from "web_component";
import NationalityInput from "../../../components/input/NationalityInput";

interface BasicInfoInputProps {
    control: any;
    onNext: () => void;
    onPrevious: () => void;
}

const BasicInfoInput: React.FC<BasicInfoInputProps> = ({
    control,
    onNext,
    onPrevious,
}) => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Basic Information
            </Typography>
            <Box component="form" noValidate autoComplete="off">
                <Box mb={2}>
                    <GlobalNameInput
                        control={control}
                        name="name_glb"
                        availableLanguages={["en", "kr", "jp"]}
                    />
                </Box>
                <Box mb={2}>
                    <DateInput control={control} name="birth_date" label="Birthday" />
                </Box>
                <Box mb={2}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid size={6}>
                            <ShortTextInput
                                control={control}
                                name="gender"
                                label="Gender"
                            />
                        </Grid>
                        <Grid size={6}>
                            <NationalityInput
                                control={control}
                                name="nationality"
                                label="Nationality"
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box mb={2}>
                    <ShortTextInput
                        control={control}
                        name="phone_number"
                        label="Phone Number"
                    />
                </Box>
                <Box mb={2}>
                    <ShortTextInput
                        control={control}
                        name="emergency_contact"
                        label="Emergency Contact"
                    />
                </Box>

                {/* 차량 보유 여부 */}
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>
                        Do you own a car?
                    </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup row name="car_ownership">
                            <FormControlLabel
                                control={
                                    <Radio
                                        {...control.register("car_ownership")}
                                        value="yes"
                                    />
                                }
                                label="Yes"
                            />
                            <FormControlLabel
                                control={
                                    <Radio
                                        {...control.register("car_ownership")}
                                        value="no"
                                    />
                                }
                                label="No"
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>

                {/* 자신을 설명하는 키워드 */}
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>
                        Describe yourself with 3 keywords
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={4}>
                            <Box mb={1}>
                                <ShortTextInput
                                    control={control}
                                    name="keyword_1"
                                    label="Keyword 1"
                                />
                            </Box>
                        </Grid>
                        <Grid size={4}>
                            <Box mb={1}>
                                <ShortTextInput
                                    control={control}
                                    name="keyword_2"
                                    label="Keyword 2"
                                />
                            </Box>
                        </Grid>
                        <Grid size={4}>
                            <Box mb={1}>
                                <ShortTextInput
                                    control={control}
                                    name="keyword_3"
                                    label="Keyword 3"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Box display="flex" justifyContent="space-between" mt={3}>
                    <NavigationButton label="previous" onClick={onPrevious} />
                    <NavigationButton label="next" onClick={onNext} />
                </Box>
            </Box>
        </Container>
    );
};

export default BasicInfoInput;
