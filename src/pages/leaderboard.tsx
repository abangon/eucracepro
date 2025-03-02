// Файл: src/pages/Leaderboard.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import CountryFlag from "../components/CountryFlag";
import { countriesData } from "../data/countries"; // Импортируем список стран

// Иконки соцсетей
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

interface UserData {
  nickname?: string;
  team?: string;
  country?: string; // Полное название страны (напр. "Czechia")
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

// Для удобства — стиль соцсетей
const socialIconStyle = {
  width: "2em",
  height: "2em",
};

// Официальные цвета
const facebookColor = "#1877F2";
const instagramColor = "#E1306C";
const youtubeColor = "#FF0000";
const tiktokColor = "#000000"; // или "#69C9D0", "#EE1D52" — на ваше усмотрение

// Функции для формирования URL соцсетей
const getFacebookUrl = (username: string) => `https://www.facebook.com/${username}`;
const getInstagramUrl = (username: string) => `https://www.instagram.com/${username}`;
const getYoutubeUrl = (username: string) => `https://www.youtube.com/@${username}`;
const getTiktokUrl = (username: string) => `https://www.tiktok.com/@${username}`;

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  // Маппинг "полное название" -> "ISO-код"
  const [countryMap, setCountryMap] = useState<Record<string, string>>({});

  // Загрузка данных из Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList = usersSnapshot.docs.map((doc) => doc.data() as UserData);
        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Загрузка маппинга стран из локального файла
  useEffect(() => {
    try {
      const map: Record<string, string> = {};
      countriesData.forEach((country) => {
        const commonName = country.name;
        const code = country.code;
        if (commonName && code) {
          map[commonName] = code;
        }
      });
      setCountryMap(map);
      console.log("Country map loaded successfully in Leaderboard:", map);
    } catch (error) {
      console.error("Error loading country map in Leaderboard:", error);
    }
  }, []);

  // Фильтрация по имени и стране
  useEffect(() => {
    let filtered = [...users];

    if (nameFilter) {
      filtered = filtered.filter((user) =>
        user.nickname?.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (countryFilter) {
      filtered = filtered.filter((user) => user.country === countryFilter);
    }

    setFilteredUsers(filtered);
  }, [nameFilter, countryFilter, users]);

  // Список уникальных полных названий стран (для выпадающего меню)
  const countries = Array.from(
    new Set(users.map((u) => u.country).filter((c): c is string => Boolean(c)))
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок с отступом */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        Leaderboard
      </Typography>

      {/* Фильтры */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          label="Filter by Name"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="country-select-label">Country</InputLabel>
          <Select
            labelId="country-select-label"
            value={countryFilter}
            label="Country"
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <MenuItem value="">
              <em>All Countries</em>
            </MenuItem>
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Таблица участников */}
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ textAlign: "left" }}><strong>Nickname</strong></TableCell>
              <TableCell sx={{ textAlign: "left" }}><strong>Team</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Country</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Facebook</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Instagram</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Youtube</strong></TableCell>
              <TableCell sx={{ textAlign: "center" }}><strong>Tiktok</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => {
              const isoCode = user.country ? countryMap[user.country] : undefined;

              return (
                <TableRow key={index} sx={{ borderBottom: "1px solid #eee" }}>
                  <TableCell sx={{ textAlign: "left" }}>{user.nickname || "–"}</TableCell>
                  <TableCell sx={{ textAlign: "left" }}>{user.team || "–"}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {isoCode ? (
                      <CountryFlag countryCode={isoCode} />
                    ) : (
                      "–"
                    )}
                  </TableCell>

                  {/* Facebook */}
                  <TableCell sx={{ textAlign: "center" }}>
                    {user.facebook ? (
                      <a
                        href={getFacebookUrl(user.facebook)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFacebook style={{ ...socialIconStyle, color: facebookColor }} />
                      </a>
                    ) : (
                      "–"
                    )}
                  </TableCell>

                  {/* Instagram */}
                  <TableCell sx={{ textAlign: "center" }}>
                    {user.instagram ? (
                      <a
                        href={getInstagramUrl(user.instagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaInstagram style={{ ...socialIconStyle, color: instagramColor }} />
                      </a>
                    ) : (
                      "–"
                    )}
                  </TableCell>

                  {/* YouTube */}
                  <TableCell sx={{ textAlign: "center" }}>
                    {user.youtube ? (
                      <a
                        href={getYoutubeUrl(user.youtube)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaYoutube style={{ ...socialIconStyle, color: youtubeColor }} />
                      </a>
                    ) : (
                      "–"
                    )}
                  </TableCell>

                  {/* TikTok */}
                  <TableCell sx={{ textAlign: "center" }}>
                    {user.tiktok ? (
                      <a
                        href={getTiktokUrl(user.tiktok)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaTiktok style={{ ...socialIconStyle, color: tiktokColor }} />
                      </a>
                    ) : (
                      "–"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Leaderboard;
