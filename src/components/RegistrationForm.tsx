import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import {
  Box,
  Button,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Pagination,
  Stack,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TikTokIcon from "@mui/icons-material/Tiktok";

// Функции формирования URL соцсетей
const getFacebookUrl = (username: string) => `https://www.facebook.com/${username}`;
const getInstagramUrl = (username: string) => `https://www.instagram.com/${username}`;
const getYoutubeUrl = (username: string) => `https://www.youtube.com/@${username}`;
const getTiktokUrl = (username: string) => `https://www.tiktok.com/@${username}`;

interface RegistrationFormProps {
  raceId: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ raceId }) => {
  const [user] = useAuthState(auth);
  const [participants, setParticipants] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<{ [key: string]: any }>({});
  const [isRegistered, setIsRegistered] = useState(false);

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const participantsPerPage = 10; // Количество участников на странице

  useEffect(() => {
    const fetchParticipants = async () => {
      const participantsRef = collection(db, `races/${raceId}/participants`);
      const snapshot = await getDocs(participantsRef);
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParticipants(usersList);

      if (user) {
        setIsRegistered(usersList.some(p => p.id === user.uid));
      }

      // Загрузка данных всех пользователей
      const usersRef = collection(db, "users");
      const usersSnap = await getDocs(usersRef);
      const usersMap: { [key: string]: any } = {};
      usersSnap.docs.forEach((doc) => {
        usersMap[doc.id] = doc.data();
      });

      setUsersData(usersMap);
    };

    fetchParticipants();
  }, [user, raceId]);

  const handleRegister = async () => {
    if (!user) return;

    const userInfo = usersData[user.uid] || {};
    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    const newParticipant = {
      nickname: userInfo.nickname || user.uid,
      team: userInfo.team || "-",
      country: userInfo.country || "-",
      facebook: userInfo.facebook || "",
      instagram: userInfo.instagram || "",
      youtube: userInfo.youtube || "",
      tiktok: userInfo.tiktok || "",
    };

    await setDoc(participantRef, newParticipant);
    setIsRegistered(true);

    const updatedSnapshot = await getDocs(collection(db, `races/${raceId}/participants`));
    setParticipants(updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleCancelRegistration = async () => {
    if (!user) return;

    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    await deleteDoc(participantRef);
    setIsRegistered(false);

    const updatedSnapshot = await getDocs(collection(db, `races/${raceId}/participants`));
    setParticipants(updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Логика пагинации
  const totalParticipants = participants.length;
  const totalPages = Math.ceil(totalParticipants / participantsPerPage);
  const startIndex = (currentPage - 1) * participantsPerPage;
  const currentParticipants = participants.slice(startIndex, startIndex + participantsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          Participants ({totalParticipants})
        </Typography>
        {user ? (
          isRegistered ? (
            <Button
              variant="contained"
              color="error"
              onClick={handleCancelRegistration}
              sx={{
                minWidth: "120px",
                minHeight: "40px",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Cancel Registration
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
              sx={{
                minWidth: "120px",
                minHeight: "40px",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Register to the race
            </Button>
          )
        ) : (
          <Button
            variant="contained"
            color="error"
            href="/sign-in"
            sx={{
              minWidth: "120px",
              minHeight: "40px",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            Please log in to register
          </Button>
        )}
      </Box>

      {participants.length === 0 ? (
        <Typography variant="body1" textAlign="center">
          No participants registered yet.
        </Typography>
      ) : (
        <Box>
          {/* Список участников в виде Accordion */}
          {currentParticipants.map((participant) => {
            const userInfo = usersData[participant.id] || {};
            const nickname = userInfo.nickname || participant.nickname || participant.id;
            const team = userInfo.team || participant.team || "-";
            const country = userInfo.country || participant.country || "-";
            const facebook = userInfo.facebook || participant.facebook;
            const instagram = userInfo.instagram || participant.instagram;
            const youtube = userInfo.youtube || participant.youtube;
            const tiktok = userInfo.tiktok || participant.tiktok;

            return (
              <Accordion key={participant.id} sx={{ mb: 1, borderRadius: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    "& .MuiAccordionSummary-content": {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      flex: 1,
                    }}
                  >
                    {nickname}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "text.secondary",
                      flex: 2,
                      textAlign: "right",
                    }}
                  >
                    {country}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2 }}>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="body2">
                      <strong>Team:</strong> {team}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2"><strong>Social:</strong></Typography>
                      <Stack direction="row" spacing={1}>
                        {facebook && (
                          <Tooltip title="Facebook" arrow>
                            <IconButton
                              href={getFacebookUrl(facebook)}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: "#1877F2",
                                "&:hover": { bgcolor: "#e8f4f8" },
                                p: 0.5,
                              }}
                            >
                              <FacebookIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {instagram && (
                          <Tooltip title="Instagram" arrow>
                            <IconButton
                              href={getInstagramUrl(instagram)}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: "#E1306C",
                                "&:hover": { bgcolor: "#fce4ec" },
                                p: 0.5,
                              }}
                            >
                              <InstagramIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {youtube && (
                          <Tooltip title="YouTube" arrow>
                            <IconButton
                              href={getYoutubeUrl(youtube)}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: "#FF0000",
                                "&:hover": { bgcolor: "#fee6e6" },
                                p: 0.5,
                              }}
                            >
                              <YouTubeIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {tiktok && (
                          <Tooltip title="TikTok" arrow>
                            <IconButton
                              href={getTiktokUrl(tiktok)}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: "#000000",
                                "&:hover": { bgcolor: "#e0e0e0" },
                                p: 0.5,
                              }}
                            >
                              <TikTokIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {/* Если нет ни одной соцсети, показываем текст */}
                        {!facebook && !instagram && !youtube && !tiktok && (
                          <Typography variant="body2" color="text.secondary">
                            No social links
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}

          {/* Пагинация */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="medium"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    minWidth: { xs: "32px", sm: "36px" },
                    minHeight: { xs: "32px", sm: "36px" },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default RegistrationForm;
