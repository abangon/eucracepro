import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

// ✅ Новый корректный URL для карты мира (Topographic JSON)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// 📌 Сопоставление стран с ISO-кодами
const countryISO: { [key: string]: string } = {
  USA: "USA",
  Canada: "CAN",
  Germany: "DEU",
  France: "FRA",
  UK: "GBR",
  Australia: "AUS",
  Brazil: "BRA",
  India: "IND",
  China: "CHN",
  Russia: "RUS",
};

const MapChart: React.FC = () => {
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const users = usersSnapshot.docs.map(doc => doc.data());

        // 📌 Собираем список стран пользователей (ISO-коды)
        const activeCountries = users
          .map(user => countryISO[user.country])
          .filter(Boolean) as string[];

        setHighlightedCountries(activeCountries);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ComposableMap projectionConfig={{ scale: 150 }} style={{ width: "100%", height: "500px" }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={highlightedCountries.includes(geo.properties.ISO_A3) ? "#1976D2" : "#E0E0E0"}
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
  );
};

export default MapChart;
