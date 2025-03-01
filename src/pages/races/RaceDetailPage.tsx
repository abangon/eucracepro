import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import RegistrationForm from "../../components/RegistrationForm";
import RaceTimingTable from "../../components/RaceTimingTable";
import RaceAdminControl from "../../components/RaceAdminControl";

const RaceDetailPage: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [raceName, setRaceName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!raceId) {
      setError("Race ID not found");
      setLoading(false);
      return;
    }

    const raceRef = doc(db, "races", raceId);

    const unsubscribe = onSnapshot(
      raceRef,
      (raceSnapshot) => {
        if (!raceSnapshot.exists()) {
          console.log(`Race ${raceId} not found.`);
          setTelemetryData([]);
          setRaceName(`Race ${raceId}`);
          setLoading(false);
          return;
        }

        const raceData = raceSnapshot.data();
        console.log("Live Race data:", raceData);

        setRaceName(raceData.name || `Race ${raceId}`);

        if (!raceData.telemetry) {
          setTelemetryData([]);
          setLoading(false);
          return;
        }

        const telemetryArray = Object.keys(raceData.telemetry).map((chipNumber) => {
          const lapEntries = Object.values(raceData.telemetry[chipNumber]);
          const lapTimes = lapEntries
            .map((lap: any) => lap.lap_time)
            .filter((time: number | null) => time !== null && time >= 3.000);

          return {
            id: chipNumber,
            chipNumber,
            lapTimes,
            bestLap: lapTimes.length > 0 ? Math.min(...lapTimes) : null,
            lastLap: lapTimes.length > 0 ? lapTimes[lapTimes.length - 1] : null,
            totalLaps: lapTimes.length,
          };
        });

        const sortedTelemetry = telemetryArray.filter((r) => r.bestLap !== null);
        sortedTelemetry.sort((a, b) => (a.bestLap ?? Infinity) - (b.bestLap ?? Infinity));

        setTelemetryData(sortedTelemetry);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching race data:", err);
        setError("Failed to load race data");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [raceId]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Кнопка "Назад" */}
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      {/* Название гонки */}
      <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 4 }}>
        {raceName} ({raceId})
      </Typography>

      {/* Блок регистрации участников */}
      <RegistrationForm raceId={raceId} />

      {/* Блок Race Timing */}
      <RaceTimingTable raceId={raceId} />

      {/* Блок Админ Управления */}
      <RaceAdminControl raceId={raceId} />
    </Box>
  );
};

export default RaceDetailPage;
