import {BiRefresh} from "react-icons/bi";
import Button from "@mui/material/Button";
import React from "react";

const RefreshButton = ({onClick}) => {
    return (
        <Button
            onClick={onClick}
            variant="contained"
            endIcon={<BiRefresh/>}
            size={"small"}
            sx={{
                textTransform: "capitalize",
                border: '1px solid #828282',
                padding: "2px 8px",
                fontSize: "14px",
                boxShadow: "none",
                backgroundColor: "#101010",
                color: "#ffffff",
                fontWeight: 700,
                ":hover": {
                    backgroundColor: "#101010",
                    boxShadow: "none",
                }
            }}>
            "Refresh Prices"
        </Button>
    );
}

export default RefreshButton;