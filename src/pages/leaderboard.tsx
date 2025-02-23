import React from "react";
import { Box } from "@mui/material";
import ReactCountryFlag from "react-country-flag";

interface CountryFlagProps {
  countryCode: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ countryCode }) => {
  return (
    <Box
      sx={{
        width: "2em",
        height: "2em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={{ width: "100%", height: "100%" }}
        title={countryCode}
      />
    </Box>
  );
};

export default CountryFlag;
