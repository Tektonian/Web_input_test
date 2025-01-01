import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface NavigationButtonsProps {
    onRight: () => void;
    onLeft: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    onRight,
    onLeft,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "fit-content",
            }}
        >
            <Button
                variant="contained"
                color="primary"
                onClick={onLeft}
                sx={{ minWidth: "auto" }}
            >
                Previous
            </Button>

            <Button
                variant="contained"
                color="secondary"
                onClick={onRight}
                sx={{ minWidth: "auto" }}
            >
                Next
            </Button>
        </Box>
    );
};

export default NavigationButtons;
