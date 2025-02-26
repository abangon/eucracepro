import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { db } from "../../utils/firebase"; // Путь к firebase
import { collection, getDocs } from "firebase/firestore";

const TestPage: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>(); // Получаем raceId из URL
  const [participants, setParticipants] = useState<any[]>([]); // Состояние для хранения участников

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        if (!raceId) return; // Проверка, что raceId существует

        console.log(`Fetching participants for race ID: ${raceId}`);
        const participantsCollection = collection(db, "races", raceId, "participants");
        const querySnapshot = await getDocs(participantsCollection);

        if (querySnapshot.empty) {
          console.warn("No participants found!");
          return;
        }

        const participantsList = querySnapshot.docs.map(doc => ({
          id: doc.id, // Получаем ID участника
          ...doc.data(), // Получаем данные участника
        }));

        console.log("Participants data:", participantsList);
        setParticipants(participantsList); // Сохраняем участников в состояние
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants(); // Загружаем участников
  }, [raceId]); // Зависимость от raceId, чтобы загружать данные при его изменении

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Participants for Race {raceId}
      </Typography>

      {participants.length === 0 ? (
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
