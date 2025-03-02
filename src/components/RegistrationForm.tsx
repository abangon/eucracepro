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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { FaTiktok } from "react-icons/fa";

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
  const [raceStatus, setRaceStatus] = useState<string>(""); // Статус гонки

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const participantsPerPage = 10; // Количество участников на странице

  useEffect(() => {
    const fetchRaceStatus = async () => {
      try {
        const raceDocRef = doc(db, "races", raceId);
        const raceDoc = await getDoc(raceDocRef);
        if (raceDoc.exists()) {
          const raceData = raceDoc.data();
          setRaceStatus(raceData.status || "");
          console.log("Race status loaded:", raceData.status);
        } else {
          console.error("Race document not found for raceId:", raceId);
        }
      } catch (error) {
        console.error("Error fetching race status:", error);
      }
    };

    const fetchParticipants = async () => {
      const participantsRef = collection(db, `races/${raceId}/participants`);
      const snapshot = await getDocs(participantsRef);
      const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setParticipants(usersList);

      if (user) {
        setIsRegistered(usersList.some((p) => p.id === user.uid));
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

    fetchRaceStatus();
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
    setParticipants(updatedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleCancelRegistration = async () => {
    if (!user) return;

    const participantRef = doc(db, `races/${raceId}/participants/${user.uid}`);
    await deleteDoc(participantRef);
    setIsRegistered(false);

    const updatedSnapshot = await getDocs(collection(db, `races/${raceId}/participants`));
    setParticipants(updatedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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

  // Проверяем, можно ли регистрироваться
  const isRegistrationDisabled = raceStatus.toLowerCase() === "active" || raceStatus.toLowerCase() === "finished";

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
            <Tooltip
              title={
                isRegistrationDisabled
                  ? "Registration is closed for Active or Finished races."
                  : "Register to the race"
              }
              arrow
            >
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRegister}
                  disabled={isRegistrationDisabled}
                  sx={{
                    minWidth: "120px",
                    minHeight: "40px",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  {isRegistrationDisabled ? "Registration Closed" : "Register to the race"}
                </Button>
              </span>
            </Tooltip>
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
          {/* Таблица для десктопных устройств */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 2, overflowX: "auto", minWidth: 0 }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell><strong>Nickname</strong></TableCell>
                    <TableCell sx={{ textAlign: "center" }}><strong>Team</strong></TableCell>
                    <TableCell sx={{ textAlign: "center" }}><strong>Country</strong></TableCell>
                    <TableCell sx={{ textAlign: "center" }}><strong>Facebook</strong></TableCell>
                    <TableCell sx={{ textAlign: "center" }}><strong>Instagram</strong></TableCell>
                    <TableCell sx={{ textAlign: "center" }}><strong>YouTube</strong></TableCell>
                    <TableCell sx={{ textAlign: "center" }}><strong>TikTok</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentParticipants.map((participant) => {
                    const userInfo = usersData[participant.id] || {};
                    const facebook = userInfo.facebook || participant.facebook;
                    const instagram = userInfo.instagram || participant.instagram;
                    const youtube = userInfo.youtube || participant.youtube;
                    const tiktok = userInfo.tiktok || participant.tiktok;

                    return (
                      <TableRow key={participant.id}>
                        <TableCell>{userInfo.nickname || participant.nickname || participant.id}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{userInfo.team || participant.team || "-"}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{userInfo.country || participant.country || "-"}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {facebook ? (
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
                          ) : "-"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {instagram ? (
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
                          ) : "-"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {youtube ? (
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
                          ) : "-"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {tiktok ? (
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
                                <FaTiktok style={{ fontSize: "1rem" }} />
                              </IconButton>
                            </Tooltip>
                          ) : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Accordion для мобильных устройств */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
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
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            justifyContent: "space-between",
                            width: "100%", // Растягиваем на всю ширину
                          }}
                        >
                          {facebook ? (
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
                          ) : (
                            <Box sx={{ width: "24px" }} /> // Пустое место для выравнивания
                          )}
                          {instagram ? (
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
                          ) : (
                            <Box sx={{ width: "24px" }} />
                          )}
                          {youtube ? (
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
                          ) : (
                            <Box sx={{ width: "24px" }} />
                          )}
                          {tiktok ? (
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
                                <FaTiktok style={{ fontSize: "1rem" }} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Box sx={{ width: "24px" }} />
                          )}
                        </Stack>
                        {/* Если нет ни одной соцсети, показываем текст */}
                        {!facebook && !instagram && !youtube && !tiktok && (
                          <Typography variant="body2" color="text.secondary">
                            No social links
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>

          {/* Пагинация для обоих видов отображения */}
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
