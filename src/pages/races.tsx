import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../utils/firebase";
import ReactCountryFlag from "react-country-flag";
import { Link } from "react-router-dom";

interface Race {
  id: string;
  name: string;
  date: string;
  track_name: string;
  country: string;
  status: string;
  race_type: string;
  participantsCount: number;
  imageData?: string;
}

const Races: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const q = query(collection(db, "races"), orderBy("date", "asc"));
        const snapshot = await getDocs(q);

        const fetched: Race[] = await Promise.all(
          snapshot.docs.map(async (raceDoc) => {
            const participantsRef = collection(db, "races", raceDoc.id, "participants");
            const participantsSnapshot = await getDocs(participantsRef);

            return {
              id: raceDoc.id,
              ...raceDoc.data(),
              participantsCount: participantsSnapshot.size, // Подсчет участников
            } as Race;
          })
        );

        setRaces(fetched);
      } catch (error) {
        console.error("Error fetching races:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  // Группируем гонки по их типу
  const groupedRaces: Record<string, Race[]> = {};
  races.forEach((race) => {
    if (!groupedRaces[race.race_type]) {
      groupedRaces[race.race_type] = [];
    }
    groupedRaces[race.race_type].push(race);
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Races
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        Object.keys(groupedRaces).map((raceType) => (
          <Box key={raceType} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {raceType} Races
            </Typography>
            <Grid container spacing={2} alignItems="stretch">
              {groupedRaces[raceType].map((race) => {
                const participantsCount = race.participantsCount || 0;

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={race.id}>
                    <Link to={`/races/${race.id}`} style={{ textDecoration: "none" }}>
                      <Card sx={{ position: "relative", borderRadius: 2, overflow: "hidden", height: "100%" }}>
                        <Chip
                          label={race.id}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            fontWeight: "bold",
                            backgroundColor: "#d287fe",
                            color: "white",
                          }}
                        />
                        {race.imageData ? (
                          <CardMedia component="img" image={race.imageData} alt={race.name} sx={{ height: 180, objectFit: "contain", backgroundColor: "#f5f5f5" }} />
                        ) : (
                          <Box sx={{ height: 180, backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography variant="body2" color="text.secondary">No Image</Typography>
                          </Box>
                        )}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{race.name}</Typography>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <ReactCountryFlag countryCode={race.country} svg style={{ width: "1.2em", height: "1.2em", marginRight: 6 }} title={race.country} />
                            <Typography variant="body2" color="text.secondary">{race.country}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">{race.track_name}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="body2" color="text.secondary">Participants: {participantsCount}</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))
      )}
    </Box>
  );
};

export default Races;
