import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Link,
  IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
// Иконка Telegram из react-icons
import { FaTelegramPlane } from "react-icons/fa";

// Пример: логотипы лежат в src/assets
// Замените пути на актуальные для вашего проекта
import OnealLogo from "../assets/oneal_logo1.jpg";
import EkolkaLogo from "../assets/ekolka_logo1.jpg";

const AboutUs: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Первая строка: описание проекта */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Welcome to EUCRACE.PRO
              </Typography>
              <Typography variant="body1">
                the premier professional organizing team for EUC (Electric
                Unicycle) races across Europe. With a passion for electric
                mobility and a commitment to excellence, we specialize in
                planning and executing thrilling races that bring together
                enthusiasts, competitors, and spectators from all walks of life.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Join us as we pave the way for the future of racing, where speed
                meets sustainability. Whether you’re a seasoned rider or a
                curious newcomer, EUCRACE.PRO is here to make every event
                unforgettable.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Вторая строка: сотрудники компании */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Карточка 1 */}
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
                {/* Временная иконка вместо фото */}
                <Avatar sx={{ width: 64, height: 64, mb: 1 }}>
                  <AccountCircle sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6">Ivan Sofin</Typography>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 2 }}>
                  Team Leader
                </Typography>

                {/* Контакты (иконки) */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  {/* Телефон */}
                  <IconButton
                    component={Link}
                    href="tel:+420774309665"
                    aria-label="phone"
                    color="primary"
                  >
                    <PhoneIcon />
                  </IconButton>
                  {/* Telegram */}
                  <IconButton
                    component={Link}
                    href="https://t.me/abangon"
                    aria-label="telegram"
                    color="primary"
                    target="_blank"
                  >
                    <FaTelegramPlane />
                  </IconButton>
                  {/* Email */}
                  <IconButton
                    component={Link}
                    href="mailto:info@eucrace.pro"
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

        {/* Карточка 2 */}
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
                <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 2 }}>
                  Project Coordinator
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <IconButton
                    component={Link}
                    href="tel:+420773555121"
                    aria-label="phone"
                    color="primary"
                  >
                    <PhoneIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    href="https://t.me/andrew_euc"
                    aria-label="telegram"
                    color="primary"
                    target="_blank"
                  >
                    <FaTelegramPlane />
                  </IconButton>
                  <IconButton
                    component={Link}
                    href="mailto:info@eucrace.pro"
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

        {/* Карточка 3 */}
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
                <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 2 }}>
                  Operations Manager
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <IconButton
                    component={Link}
                    href="tel:+420603838622"
                    aria-label="phone"
                    color="primary"
                  >
                    <PhoneIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    href="https://t.me/andrew_euc"
                    aria-label="telegram"
                    color="primary"
                    target="_blank"
                  >
                    <FaTelegramPlane />
                  </IconButton>
                  <IconButton
                    component={Link}
                    href="mailto:info@eucrace.pro"
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

      {/* Третья строка: спонсоры */}
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
                {/* Лого Oneal */}
                <Box sx={{ width: 150, height: "auto" }}>
                  <img
                    src={OnealLogo}
                    alt="Oneal"
                    style={{ width: "100%", height: "auto", objectFit: "contain" }}
                  />
                </Box>
                {/* Лого Ekolka */}
                <Box sx={{ width: 150, height: "auto" }}>
                  <img
                    src={EkolkaLogo}
                    alt="Ekolka"
                    style={{ width: "100%", height: "auto", objectFit: "contain" }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;
