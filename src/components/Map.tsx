import React from "react";
import { Box } from "@mui/material";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapProps {
  highlightedCountries: string[];
}

const Map: React.FC<MapProps> = ({ highlightedCountries }) => {
  return (
    <Box sx={{ width: "100%", height: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: "100%", height: "100%" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={highlightedCountries.includes(geo.properties.NAME) ? "#1976D2" : "#E0E0E0"}
                stroke="#FFF"
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#1565C0", outline: "none" },
                  pressed: { fill: "#0D47A1", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </Box>
  );
};

export default Map;
