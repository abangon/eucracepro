import React from "react";
import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { FaTelegramPlane } from "react-icons/fa";

import OnealLogo from "../assets/oneal_logo1.jpg";
import EkolkaLogo from "../assets/ekolka_logo1.jpg";

const AboutUs: React.FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleEmailClick = (email: string) => {
    setSnackbarMessage(email);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 1. Описание проекта */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Welcome to EUCRACE.PRO
              </Typography>
              <Typography variant="body1">
                The premier professional organizing team for EUC (Electric
                Unicycle) races across Europe. With a passion for electric
                mobility and a commitment to excellence, we specialize in planning
                and executing thrilling races that bring together enthusiasts,
                competitors, and spectators from all walks of life.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Join us as we pave the way for the future of racing, where speed
                meets sustainability. Whether you’re a seasoned rider or a curious
                newcomer, EUCRACE.PRO is here to make every event unforgettable.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 2. Команда */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Карточка сотрудника 1 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Avatar sx={{ width: 64, height: 64, mb: 1 }}>
                  <AccountCircle sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6">Ivan Sofin</Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  Team Leader
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <IconButton
                    onClick={() => window.location.assign("tel:+420774309665")}
                    aria-label="phone"
                    color="primary"
                  >
                    <PhoneIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      window.open("https://t.me/abangon", "_blank")
                    }
                    aria-label="telegram"
                    color="primary"
                  >
                    <FaTelegramPlane />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEmailClick("info@eucrace.pro")}
                    aria-label="email"
                    color="primary"
                  >
                    <EmailIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Карточка сотрудника 2 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Avatar sx={{ width: 64, height: 64, mb: 1 }}>
                  <AccountCircle sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6">Andrey Bordeyanu</Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  Project Coordinator
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <IconButton
                    onClick={() => window.location.assign("tel:+420773555121")}
                    aria-label="phone"
                    color="primary"
                  >
                    <PhoneIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      window.open("https://t.me/andrew_euc", "_blank")
                    }
                    aria-label="telegram"
                    color="primary"
                  >
                    <FaTelegramPlane />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEmailClick("info@eucrace.pro")}
                    aria-label="email"
                    color="primary"
                  >
                    <EmailIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Карточка сотрудника 3 (Jiří Ohainka) */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Avatar sx={{ width: 64, height: 64, mb: 1 }}>
                  <AccountCircle sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6">Jiří Ohainka</Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  Operations Manager
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <IconButton
                    onClick={() => window.location.assign("tel:+420603838622")}
                    aria-label="phone"
                    color="primary"
                  >
                    <PhoneIcon />
                  </IconButton>
                  {/* У Jiří нет Telegram, поэтому иконка не отображается */}
                  <IconButton
                    onClick={() => handleEmailClick("info@eucrace.pro")}
                    aria-label="email"
                    color="primary"
                  >
                    <EmailIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 3. Спонсоры */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Sponsors
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                  flexWrap: "wrap",
                  mt: 2,
                }}
              >
                <Box sx={{ width: 150, height: "auto" }}>
                  <img
                    src={OnealLogo}
                    alt="Oneal"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Box sx={{ width: 150, height: "auto" }}>
                  <img
                    src={EkolkaLogo}
                    alt="Ekolka"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar для отображения email */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AboutUs;
