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

  // Загрузка маппинга стран (полное название -> ISO2)
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const map: Record<string, string> = {};

        data.forEach((countryObj: any) => {
          const commonName = countryObj?.name?.common; // например "Czechia"
          const code = countryObj?.cca2;              // "CZ"
          if (commonName && code) {
            map[commonName] = code;
          }
        });
        setCountryMap(map);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
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
              <TableCell><strong>Nickname</strong></TableCell>
              <TableCell><strong>Team</strong></TableCell>
              <TableCell><strong>Country</strong></TableCell>
              <TableCell><strong>Facebook</strong></TableCell>
              <TableCell><strong>Instagram</strong></TableCell>
              <TableCell><strong>Youtube</strong></TableCell>
              <TableCell><strong>Tiktok</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => {
              const isoCode = user.country ? countryMap[user.country] : undefined;

              return (
                <TableRow key={index} sx={{ borderBottom: "1px solid #eee" }}>
                  <TableCell>{user.nickname || "–"}</TableCell>
                  <TableCell>{user.team || "–"}</TableCell>
                  <TableCell>
                    {isoCode ? (
                      <CountryFlag countryCode={isoCode} />
                    ) : (
                      "–"
                    )}
                  </TableCell>

                  {/* Facebook */}
                  <TableCell>
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
                  <TableCell>
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
                  <TableCell>
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
                  <TableCell>
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
