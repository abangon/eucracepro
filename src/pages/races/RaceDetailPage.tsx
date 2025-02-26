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
  const navigate = useNavigate();

  useEffect(() => {
    if (!raceId) return;

    const raceRef = doc(db, "races", raceId);

    const unsubscribe = onSnapshot(raceRef, (raceSnapshot) => {
      if (!raceSnapshot.exists()) {
        console.log(`Race ${raceId} not found.`);
        setTelemetryData([]);
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
    });

    return () => unsubscribe();
  }, [raceId]);

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
      <RaceTimingTable telemetryData={telemetryData} raceId={raceId} loading={loading} />
    </Box>
  );
};

<RaceAdminControl raceId={raceId} />

export default RaceDetailPage;
