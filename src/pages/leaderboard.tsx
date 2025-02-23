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
import { db } from "../utils/firebase"; // Убедитесь, что путь корректный
import CountryFlag from "../components/CountryFlag";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

interface UserData {
  nickname?: string;
  team?: string;
  country?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("");

  // Загрузка данных из Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList: UserData[] = usersSnapshot.docs.map((doc) => doc.data() as UserData);
        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Фильтрация пользователей по имени и стране
  useEffect(() => {
    let filtered = users;
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

  // Формируем список уникальных стран для выпадающего меню
  const countries = Array.from(
    new Set(users.map((user) => user.country).filter((c): c is string => Boolean(c)))
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Leaderboard
      </Typography>

      {/* Фильтры */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
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
        <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
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
            {filteredUsers.map((user, index) => (
              <TableRow key={index} sx={{ borderBottom: "1px solid #eee" }}>
                <TableCell>{user.nickname || "–"}</TableCell>
                <TableCell>{user.team || "–"}</TableCell>
                <TableCell>
                  {user.country ? <CountryFlag countryCode={user.country} /> : "–"}
                </TableCell>
                <TableCell>
                  {user.facebook ? (
                    <a href={user.facebook} target="_blank" rel="noopener noreferrer">
                      <FaFacebook size={20} />
                    </a>
                  ) : (
                    "–"
                  )}
                </TableCell>
                <TableCell>
                  {user.instagram ? (
                    <a href={user.instagram} target="_blank" rel="noopener noreferrer">
                      <FaInstagram size={20} />
                    </a>
                  ) : (
                    "–"
                  )}
                </TableCell>
                <TableCell>
                  {user.youtube ? (
                    <a href={user.youtube} target="_blank" rel="noopener noreferrer">
                      <FaYoutube size={20} />
                    </a>
                  ) : (
                    "–"
                  )}
                </TableCell>
                <TableCell>
                  {user.tiktok ? (
                    <a href={user.tiktok} target="_blank" rel="noopener noreferrer">
                      <FaTiktok size={20} />
                    </a>
                  ) : (
                    "–"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Leaderboard;
