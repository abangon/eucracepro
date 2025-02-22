import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const Map: React.FC = () => {
  const [activeCountries, setActiveCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const users = usersSnapshot.docs.map((doc) => doc.data());

        // Получаем список стран, выбранных пользователями
        const countries = users
          .map((user) => user.country)
          .filter((country) => country);

        setActiveCountries(countries);
      } catch (error) {
        console.error("Error fetching users' countries:", error);
      }
    };
    fetchCountries();
  }, []);

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 3, p: 2, mt: 3 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          🌍 Registered Racers by Country
        </Typography>
        <Box sx={{ width: "100%", height: "100%" }}>
          <ComposableMap projectionConfig={{ scale: 120 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isActive = activeCountries.includes(geo.properties.name);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isActive ? "#4CAF50" : "#D6D6DA"}
                      stroke="#FFFFFF"
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#2E7D32", outline: "none" },
                        pressed: { fill: "#1B5E20", outline: "none" },
                      }}
                    />
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
