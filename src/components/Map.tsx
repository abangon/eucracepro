import React, { useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Tooltip from "@mui/material/Tooltip";

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

interface MapProps {
  highlightedCountries: { [key: string]: number }; // Объект, где ключ - страна, значение - кол-во гонщиков
}

const Map: React.FC<MapProps> = ({ highlightedCountries }) => {
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 3, p: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
          🌍 Registered Racers by Country
        </Typography>
        <Box sx={{ width: "100%", height: 600, position: "relative" }}>
          <ComposableMap projectionConfig={{ scale: 220 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.NAME;
                  const racerCount = highlightedCountries[countryName] || 0;
                  const isHighlighted = racerCount > 0;

                  return (
                    <Tooltip
                      key={geo.rsmKey}
                      title={isHighlighted ? `${countryName}: ${racerCount} racers` : ""}
                      arrow
                    >
                      <Geography
                        geography={geo}
                        fill={isHighlighted ? "#7B1FA2" : "#E0E0E0"} // Фиолетовый для активных стран
                        stroke="#FFF"
                        strokeWidth={0.5}
                        onMouseEnter={() => setTooltipContent(isHighlighted ? `${countryName}: ${racerCount} racers` : null)}
                        onMouseLeave={() => setTooltipContent(null)}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#4A148C", outline: "none" }, // Более темный фиолетовый при наведении
                          pressed: { fill: "#4A148C", outline: "none" },
                        }}
                      />
                    </Tooltip>
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Map;
