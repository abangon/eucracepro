import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebase";

// Импорт компонентов из папки components
import RaceDescription from "../../components/RaceDescription";
import RegistrationForm from "../../components/RegistrationForm";
import PaymentSection from "../../components/PaymentSection";
import LapTimesTable from "../../components/LapTimesTable";
import PointsTable from "../../components/PointsTable";

interface Race {
  id: string;
  name: string;
  date: string;
  track_name: string;
  country: string;
  status: string;
  description?: string;
  lapTimes?: Array<any>;
  points?: Array<any>;
  // Другие поля, если требуются
}

const RaceDetailPage: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const [race, setRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRace = async () => {
      if (!raceId) return;
      try {
        const raceRef = doc(db, "races", raceId);
        const raceSnap = await getDoc(raceRef);
        if (raceSnap.exists()) {
          setRace({ id: raceSnap.id, ...raceSnap.data() } as Race);
        } else {
          console.error("Race not found");
        }
      } catch (error) {
        console.error("Error fetching race details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRace();
  }, [raceId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!race) return <Typography>Race not found.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {race.name}
      </Typography>
      <RaceDescription description={race.description || "Нет описания"} />
      <RegistrationForm raceId={raceId} />
      <PaymentSection raceId={raceId} />
      <LapTimesTable lapTimes={race.lapTimes || []} />
      <PointsTable points={race.points || []} />
    </Box>
  );
};

export default RaceDetailPage;
