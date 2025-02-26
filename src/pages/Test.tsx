import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

const TestPage: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>(); // Получаем raceId из URL
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        if (!raceId) {
          console.error("❌ Ошибка: raceId не найден!");
          return;
        }

        console.log(`🚀 Загружаем участников для гонки: ${raceId}`);
        const participantsCollection = collection(db, "races", raceId, "participants");
        const querySnapshot = await getDocs(participantsCollection);

        if (querySnapshot.empty) {
          console.warn("⚠️ Нет участников!");
          setParticipants([]);
          setLoading(false);
          return;
        }

        const participantsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("✅ Участники загружены:", participantsList);
        setParticipants(participantsList);
        setLoading(false);
      } catch (error) {
        console.error("❌ Ошибка загрузки участников:", error);
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [raceId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Participants for Race {raceId}
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : participants.length === 0 ? (
        <Typography>No participants found</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Participant ID</strong></TableCell>
                <TableCell><strong>Chip Number</strong></TableCell>
                <TableCell><strong>Nickname</strong></TableCell>
                <TableCell><strong>Race Number</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.id}</TableCell>
                  <TableCell>{participant.chipNumber}</TableCell>
                  <TableCell>{participant.nickname || "Unknown"}</TableCell>
                  <TableCell>{participant.raceNumber || "Not assigned"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TestPage;
