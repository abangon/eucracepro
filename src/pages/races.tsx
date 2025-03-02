// Файл: src/pages/Races.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import { keyframes } from "@mui/system";
import { collection, getDocs, query, orderBy, setDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ReactCountryFlag from "react-country-flag";
import { Link } from "react-router-dom";

// Полный список стран
const countriesData: { name: string; code: string }[] = [
  { name: "Afghanistan", code: "AF" },
  { name: "Åland Islands", code: "AX" },
  { name: "Albania", code: "AL" },
  { name: "Algeria", code: "DZ" },
  { name: "American Samoa", code: "AS" },
  { name: "Andorra", code: "AD" },
  { name: "Angola", code: "AO" },
  { name: "Anguilla", code: "AI" },
  { name: "Antarctica", code: "AQ" },
  { name: "Antigua and Barbuda", code: "AG" },
  { name: "Argentina", code: "AR" },
  { name: "Armenia", code: "AM" },
  { name: "Aruba", code: "AW" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Bahamas", code: "BS" },
  { name: "Bahrain", code: "BH" },
  { name: "Bangladesh", code: "BD" },
  { name: "Barbados", code: "BB" },
  { name: "Belarus", code: "BY" },
  { name: "Belgium", code: "BE" },
  { name: "Belize", code: "BZ" },
  { name: "Benin", code: "BJ" },
  { name: "Bermuda", code: "BM" },
  { name: "Bhutan", code: "BT" },
  { name: "Bolivia", code: "BO" },
  { name: "Bonaire, Sint Eustatius and Saba", code: "BQ" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Botswana", code: "BW" },
  { name: "Bouvet Island", code: "BV" },
  { name: "Brazil", code: "BR" },
  { name: "British Indian Ocean Territory", code: "IO" },
  { name: "Brunei Darussalam", code: "BN" },
  { name: "Bulgaria", code: "BG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cabo Verde", code: "CV" },
  { name: "Cambodia", code: "KH" },
  { name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },
  { name: "Cayman Islands", code: "KY" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Christmas Island", code: "CX" },
  { name: "Cocos (Keeling) Islands", code: "CC" },
  { name: "Colombia", code: "CO" },
  { name: "Comoros", code: "KM" },
  { name: "Congo", code: "CG" },
  { name: "Congo, Democratic Republic of the", code: "CD" },
  { name: "Cook Islands", code: "CK" },
  { name: "Costa Rica", code: "CR" },
  { name: "Côte d'Ivoire", code: "CI" },
  { name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },
  { name: "Curaçao", code: "CW" },
  { name: "Cyprus", code: "CY" },
  { name: "Czechia", code: "CZ" },
  { name: "Denmark", code: "DK" },
  { name: "Djibouti", code: "DJ" },
  { name: "Dominica", code: "DM" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "Egypt", code: "EG" },
  { name: "El Salvador", code: "SV" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Eritrea", code: "ER" },
  { name: "Estonia", code: "EE" },
  { name: "Eswatini", code: "SZ" },
  { name: "Ethiopia", code: "ET" },
  { name: "Falkland Islands (Malvinas)", code: "FK" },
  { name: "Faroe Islands", code: "FO" },
  { name: "Fiji", code: "FJ" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "French Guiana", code: "GF" },
  { name: "French Polynesia", code: "PF" },
  { name: "French Southern Territories", code: "TF" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Georgia", code: "GE" },
  { name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },
  { name: "Gibraltar", code: "GI" },
  { name: "Greece", code: "GR" },
  { name: "Greenland", code: "GL" },
  { name: "Grenada", code: "GD" },
  { name: "Guadeloupe", code: "GP" },
  { name: "Guam", code: "GU" },
  { name: "Guatemala", code: "GT" },
  { name: "Guernsey", code: "GG" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Guyana", code: "GY" },
  { name: "Haiti", code: "HT" },
  { name: "Heard Island and McDonald Islands", code: "HM" },
  { name: "Holy See", code: "VA" },
  { name: "Honduras", code: "HN" },
  { name: "Hong Kong", code: "HK" },
  { name: "Hungary", code: "HU" },
  { name: "Iceland", code: "IS" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Iran", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Ireland", code: "IE" },
  { name: "Isle of Man", code: "IM" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Jamaica", code: "JM" },
  { name: "Japan", code: "JP" },
  { name: "Jersey", code: "JE" },
  { name: "Jordan", code: "JO" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" },
  { name: "Kiribati", code: "KI" },
  { name: "Korea, Democratic People's Republic of", code: "KP" },
  { name: "Korea, Republic of", code: "KR" },
  { name: "Kuwait", code: "KW" },
  { name: "Kyrgyzstan", code: "KG" },
  { name: "Lao People's Democratic Republic", code: "LA" },
  { name: "Latvia", code: "LV" },
  { name: "Lebanon", code: "LB" },
  { name: "Lesotho", code: "LS" },
  { name: "Liberia", code: "LR" },
  { name: "Libya", code: "LY" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Macao", code: "MO" },
  { name: "Madagascar", code: "MG" },
  { name: "Malawi", code: "MW" },
  { name: "Malaysia", code: "MY" },
  { name: "Maldives", code: "MV" },
  { name: "Mali", code: "ML" },
  { name: "Malta", code: "MT" },
  { name: "Marshall Islands", code: "MH" },
  { name: "Martinique", code: "MQ" },
  { name: "Mauritania", code: "MR" },
  { name: "Mauritius", code: "MU" },
  { name: "Mayotte", code: "YT" },
  { name: "Mexico", code: "MX" },
  { name: "Micronesia", code: "FM" },
  { name: "Moldova", code: "MD" },
  { name: "Monaco", code: "MC" },
  { name: "Mongolia", code: "MN" },
  { name: "Montenegro", code: "ME" },
  { name: "Montserrat", code: "MS" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Myanmar", code: "MM" },
  { name: "Namibia", code: "NA" },
  { name: "Nauru", code: "NR" },
  { name: "Nepal", code: "NP" },
  { name: "Netherlands", code: "NL" },
  { name: "New Caledonia", code: "NC" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nicaragua", code: "NI" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "Niue", code: "NU" },
  { name: "Norfolk Island", code: "NF" },
  { name: "North Macedonia", code: "MK" },
  { name: "Northern Mariana Islands", code: "MP" },
  { name: "Norway", code: "NO" },
  { name: "Oman", code: "OM" },
  { name: "Pakistan", code: "PK" },
  { name: "Palau", code: "PW" },
  { name: "Palestine, State of", code: "PS" },
  { name: "Panama", code: "PA" },
  { name: "Papua New Guinea", code: "PG" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Pitcairn", code: "PN" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Puerto Rico", code: "PR" },
  { name: "Qatar", code: "QA" },
  { name: "Réunion", code: "RE" },
  { name: "Romania", code: "RO" },
  { name: "Russian Federation", code: "RU" },
  { name: "Rwanda", code: "RW" },
  { name: "Saint Barthélemy", code: "BL" },
  { name: "Saint Helena, Ascension and Tristan da Cunha", code: "SH" },
  { name: "Saint Kitts and Nevis", code: "KN" },
  { name: "Saint Lucia", code: "LC" },
  { name: "Saint Martin (French part)", code: "MF" },
  { name: "Saint Pierre and Miquelon", code: "PM" },
  { name: "Saint Vincent and the Grenadines", code: "VC" },
  { name: "Samoa", code: "WS" },
  { name: "San Marino", code: "SM" },
  { name: "Sao Tome and Principe", code: "ST" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Senegal", code: "SN" },
  { name: "Serbia", code: "RS" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Singapore", code: "SG" },
  { name: "Sint Maarten (Dutch part)", code: "SX" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "Solomon Islands", code: "SB" },
  { name: "Somalia", code: "SO" },
  { name: "South Africa", code: "ZA" },
  { name: "South Georgia and the South Sandwich Islands", code: "GS" },
  { name: "South Sudan", code: "SS" },
  { name: "Spain", code: "ES" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Sudan", code: "SD" },
  { name: "Suriname", code: "SR" },
  { name: "Svalbard and Jan Mayen", code: "SJ" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Syrian Arab Republic", code: "SY" },
  { name: "Taiwan", code: "TW" },
  { name: "Tajikistan", code: "TJ" },
  { name: "Tanzania", code: "TZ" },
  { name: "Thailand", code: "TH" },
  { name: "Timor-Leste", code: "TL" },
  { name: "Togo", code: "TG" },
  { name: "Tokelau", code: "TK" },
  { name: "Tonga", code: "TO" },
  { name: "Trinidad and Tobago", code: "TT" },
  { name: "Tunisia", code: "TN" },
  { name: "Turkey", code: "TR" },
  { name: "Turkmenistan", code: "TM" },
  { name: "Turks and Caicos Islands", code: "TC" },
  { name: "Tuvalu", code: "TV" },
  { name: "Uganda", code: "UG" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "United States Minor Outlying Islands", code: "UM" },
  { name: "Uruguay", code: "UY" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Vanuatu", code: "VU" },
  { name: "Venezuela", code: "VE" },
  { name: "Viet Nam", code: "VN" },
  { name: "Virgin Islands (British)", code: "VG" },
  { name: "Virgin Islands (U.S.)", code: "VI" },
  { name: "Wallis and Futuna", code: "WF" },
  { name: "Western Sahara", code: "EH" },
  { name: "Yemen", code: "YE" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" },
];

const blinker = keyframes`
  50% { opacity: 0; }
`;

interface Race {
  id: string;
  name: string;
  date: string;
  track_name: string;
  country: string;
  status: string;
  participants: string[];
  race_type: string;
  imageData?: string;
}

const Races: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [newRaceName, setNewRaceName] = useState("");
  const [newRaceDate, setNewRaceDate] = useState("");
  const [newRaceTrackName, setNewRaceTrackName] = useState("");
  const [newRaceCountry, setNewRaceCountry] = useState("");
  const [newRaceStatus, setNewRaceStatus] = useState("Registration");
  const [newRaceType, setNewRaceType] = useState("Race");
  const [newRaceImage, setNewRaceImage] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const [editingRace, setEditingRace] = useState<Race | null>(null);
  const [editRaceName, setEditRaceName] = useState("");
  const [editRaceDate, setEditRaceDate] = useState("");
  const [editRaceTrackName, setEditRaceTrackName] = useState("");
  const [editRaceCountry, setEditRaceCountry] = useState("");
  const [editRaceStatus, setEditRaceStatus] = useState("");
  const [editRaceType, setEditRaceType] = useState("");
  const [editRaceImage, setEditRaceImage] = useState("");
  const [editFormMessage, setEditFormMessage] = useState("");

  const [countryMap, setCountryMap] = useState<Record<string, string>>({});
  const [countries, setCountries] = useState<string[]>([]);

  const generateRaceId = () => {
    return (Math.floor(Math.random() * 9000) + 1000).toString();
  };

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const q = query(collection(db, "races"), orderBy("date", "asc"));
        const snapshot = await getDocs(q);

        const fetched: Race[] = await Promise.all(
          snapshot.docs.map(async (raceDoc) => {
            const participantsRef = collection(db, "races", raceDoc.id, "participants");
            const participantsSnapshot = await getDocs(participantsRef);
            return {
              id: raceDoc.id,
              ...raceDoc.data(),
              participantsCount: participantsSnapshot.size,
            } as Race;
          })
        );

        setRaces(fetched);
        console.log("Races loaded successfully:", fetched);
      } catch (error) {
        console.error("Error fetching races:", error);
        setFormMessage("Failed to load races. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, []);

  useEffect(() => {
    try {
      const map: Record<string, string> = {};
      const names: string[] = [];

      countriesData.forEach((country: { name: string; code: string }) => {
        const commonName = country.name;
        const code = country.code;
        if (commonName && code) {
          map[commonName] = code;
          names.push(commonName);
        }
      });

      names.sort();
      setCountryMap(map);
      setCountries(names);
      console.log("Countries loaded successfully:", names);
    } catch (err) {
      console.error("Error loading countries:", err);
      setFormMessage("Failed to load countries from local data.");
      const fallbackCountries = ["USA", "Canada", "UK"];
      const fallbackMap = { USA: "US", Canada: "CA", UK: "GB" };
      setCountries(fallbackCountries);
      setCountryMap(fallbackMap);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === "ztnWBUkh6dUcXLOH8D5nLBEYm2J2") {
        console.log("Admin logged in:", user.uid);
        setIsAdmin(true);
      } else {
        console.log("Non-admin or not logged in:", user?.uid);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          if (isEdit) {
            setEditRaceImage(reader.result);
            console.log("Edit race image updated:", reader.result.slice(0, 50));
          } else {
            setNewRaceImage(reader.result);
            console.log("New race image uploaded:", reader.result.slice(0, 50));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateRace = async () => {
    if (!newRaceName || !newRaceDate || !newRaceTrackName || !newRaceCountry) {
      setFormMessage("Please fill all fields.");
      console.log("Create race failed: Missing required fields");
      return;
    }
    const raceId = generateRaceId();
    const newRaceData = {
      name: newRaceName,
      date: newRaceDate,
      track_name: newRaceTrackName,
      country: newRaceCountry,
      status: newRaceStatus,
      race_type: newRaceType,
      participants: [] as string[],
      ...(newRaceImage && { imageData: newRaceImage }),
    };

    try {
      await setDoc(doc(db, "races", raceId), newRaceData);
      setFormMessage(`Race created with ID: ${raceId}`);
      setNewRaceName("");
      setNewRaceDate("");
      setNewRaceTrackName("");
      setNewRaceCountry("");
      setNewRaceStatus("Registration");
      setNewRaceType("Race");
      setNewRaceImage("");

      const q = query(collection(db, "races"), orderBy("date", "asc"));
      const snapshot = await getDocs(q);
      const fetched: Race[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Race[];
      setRaces(fetched);
      console.log("Race created successfully:", raceId);
    } catch (error: any) {
      console.error("Error creating race:", error);
      setFormMessage("Error creating race: " + error.message);
    }
  };

  const handleEditRace = (race: Race) => {
    setEditingRace(race);
    setEditRaceName(race.name);
    setEditRaceDate(race.date);
    setEditRaceTrackName(race.track_name);
    setEditRaceCountry(race.country);
    setEditRaceStatus(race.status);
    setEditRaceType(race.race_type);
    setEditRaceImage(race.imageData || "");
    setEditFormMessage("");
    console.log("Editing race:", race.id);
  };

  const handleUpdateRace = async () => {
    if (!editingRace) return;

    if (!editRaceName || !editRaceDate || !editRaceTrackName || !editRaceCountry) {
      setEditFormMessage("Please fill all fields.");
      console.log("Update race failed: Missing required fields");
      return;
    }

    const updatedRaceData = {
      name: editRaceName,
      date: editRaceDate,
      track_name: editRaceTrackName,
      country: editRaceCountry,
      status: editRaceStatus,
      race_type: editRaceType,
      participants: editingRace.participants,
      ...(editRaceImage && { imageData: editRaceImage }),
    };

    try {
      await updateDoc(doc(db, "races", editingRace.id), updatedRaceData);
      setEditFormMessage("Race updated successfully!");
      
      const updatedRaces = races.map((race) =>
        race.id === editingRace.id ? { ...race, ...updatedRaceData } : race
      );
      setRaces(updatedRaces);
      
      setEditingRace(null);
      setEditRaceName("");
      setEditRaceDate("");
      setEditRaceTrackName("");
      setEditRaceCountry("");
      setEditRaceStatus("");
      setEditRaceType("");
      setEditRaceImage("");
      console.log("Race updated successfully:", editingRace.id);
    } catch (error: any) {
      console.error("Error updating race:", error);
      setEditFormMessage("Error updating race: " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingRace(null);
    setEditRaceName("");
    setEditRaceDate("");
    setEditRaceTrackName("");
    setEditRaceCountry("");
    setEditRaceStatus("");
    setEditRaceType("");
    setEditRaceImage("");
    setEditFormMessage("");
    console.log("Race editing cancelled");
  };

  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const capitalizeStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === "registration") return "green";
    if (lower === "active") return "red";
    if (lower === "finished") return "black";
    return "black";
  };

  const groupedRaces = races.reduce((acc, race) => {
    const type = race.race_type || "Uncategorized";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(race);
    return acc;
  }, {} as Record<string, Race[]>);

  Object.keys(groupedRaces).forEach((type) => {
    groupedRaces[type].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  const categoryOrder = ["Race", "Camp", "Training"];
  const displayNames: Record<string, string> = {
    Race: "Upcoming Races",
    Camp: "Upcoming Camp",
    Training: "Upcoming Training",
    Uncategorized: "Uncategorized",
  };

  const raceTypes = Object.keys(groupedRaces).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
  });

  const renderRaceCard = (race: Race) => {
    const isoCode = countryMap[race.country] || "";
    const participantsCount = race.participantsCount || 0;

    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={race.id}>
        <Box sx={{ position: "relative" }}>
          {isAdmin ? (
            <IconButton
              onClick={() => handleEditRace(race)}
              sx={{
                position: "absolute",
                top: 8,
                right: 48, // Смещаем левее, чтобы не перекрывать чип
                backgroundColor: "white",
                color: "blue", // Делаем иконку заметной
                zIndex: 10, // Устанавливаем zIndex, чтобы иконка была поверх чипа
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <EditIcon sx={{ fontSize: 24 }} /> {/* Увеличиваем размер иконки */}
              <Typography variant="caption" sx={{ color: "red", position: "absolute", top: -10 }}>
                Edit
              </Typography> {/* Добавляем отладочный текст */}
            </IconButton>
          ) : (
            console.log("Not rendering Edit button: User is not admin")
          )}
          <Link to={`/races/${race.id}`} style={{ textDecoration: "none" }}>
            <Card
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Chip
                label={race.id}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8, // Оставляем чип на месте
                  fontWeight: "bold",
                  backgroundColor: "#d287fe",
                  color: "white",
                  zIndex: 5,
                }}
              />
              {race.imageData ? (
                <CardMedia
                  component="img"
                  image={race.imageData}
                  alt={race.name}
                  sx={{
                    height: 180,
                    objectFit: "contain",
                    backgroundColor: "#f5f5f5",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 180,
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No Image
                  </Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {race.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {isoCode ? (
                    <ReactCountryFlag
                      countryCode={isoCode}
                      svg
                      style={{
                        width: "1.2em",
                        height: "1.2em",
                        marginRight: 6,
                      }}
                      title={isoCode}
                    />
                  ) : (
                    <Typography variant="body2" color="error" sx={{ marginRight: 1 }}>
                      (Flag not found)
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {race.country}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(race.date)}
                  </Typography>
                </Box>
                {race.track_name && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {race.track_name}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Participants: {participantsCount}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: getStatusColor(race.status),
                    }}
                  >
                    Status: {capitalizeStatus(race.status)}
                  </Typography>
                  {(race.status.toLowerCase() === "registration" ||
                    race.status.toLowerCase() === "active") && (
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: getStatusColor(race.status),
                        ml: 1,
                        animation: `${blinker} 1.5s linear infinite`,
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Link>
        </Box>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : races.length === 0 ? (
        <Typography>No events available.</Typography>
      ) : (
        <Box>
          {raceTypes.map((raceType) => (
            <Box key={raceType} sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                {displayNames[raceType] || raceType}
              </Typography>
              <Grid container spacing={2} alignItems="stretch">
                {groupedRaces[raceType].map((race) => renderRaceCard(race))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      {isAdmin && (
        <>
          {editingRace && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Edit Race (ID: {editingRace.id})
              </Typography>
              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxWidth: 400,
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  label="Race Name"
                  variant="outlined"
                  value={editRaceName}
                  onChange={(e) => setEditRaceName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Date"
                  type="date"
                  variant="outlined"
                  value={editRaceDate}
                  onChange={(e) => setEditRaceDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Track Name"
                  variant="outlined"
                  value={editRaceTrackName}
                  onChange={(e) => setEditRaceTrackName(e.target.value)}
                  fullWidth
                />
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="edit-country-select-label">Country</InputLabel>
                  <Select
                    labelId="edit-country-select-label"
                    value={editRaceCountry}
                    label="Country"
                    onChange={(e) => setEditRaceCountry(e.target.value)}
                  >
                    {countries.map((countryName) => (
                      <MenuItem key={countryName} value={countryName}>
                        {countryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="edit-status-select-label">Status</InputLabel>
                  <Select
                    labelId="edit-status-select-label"
                    value={editRaceStatus}
                    label="Status"
                    onChange={(e) => setEditRaceStatus(e.target.value)}
                  >
                    <MenuItem value="Registration">Registration</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Finished">Finished</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="edit-race-type-select-label">Race Type</InputLabel>
                  <Select
                    labelId="edit-race-type-select-label"
                    value={editRaceType}
                    label="Race Type"
                    onChange={(e) => setEditRaceType(e.target.value)}
                  >
                    <MenuItem value="Race">Race</MenuItem>
                    <MenuItem value="Camp">Camp</MenuItem>
                    <MenuItem value="Training">Training</MenuItem>
                  </Select>
                </FormControl>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Upload New Race Image (optional):
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="contained" onClick={handleUpdateRace}>
                    Update Race
                  </Button>
                  <Button variant="outlined" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </Box>
                {editFormMessage && (
                  <Typography variant="body2" color="text.secondary">
                    {editFormMessage}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Create New Race
            </Typography>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 400,
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="Race Name"
                variant="outlined"
                value={newRaceName}
                onChange={(e) => setNewRaceName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                variant="outlined"
                value={newRaceDate}
                onChange={(e) => setNewRaceDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Track Name"
                variant="outlined"
                value={newRaceTrackName}
                onChange={(e) => setNewRaceTrackName(e.target.value)}
                fullWidth
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel id="country-select-label">Country</InputLabel>
                <Select
                  labelId="country-select-label"
                  value={newRaceCountry}
                  label="Country"
                  onChange={(e) => setNewRaceCountry(e.target.value)}
                >
                  {countries.map((countryName) => (
                    <MenuItem key={countryName} value={countryName}>
                      {countryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={newRaceStatus}
                  label="Status"
                  onChange={(e) => setNewRaceStatus(e.target.value)}
                >
                  <MenuItem value="Registration">Registration</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Finished">Finished</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="race-type-select-label">Race Type</InputLabel>
                <Select
                  labelId="race-type-select-label"
                  value={newRaceType}
                  label="Race Type"
                  onChange={(e) => setNewRaceType(e.target.value)}
                >
                  <MenuItem value="Race">Race</MenuItem>
                  <MenuItem value="Camp">Camp</MenuItem>
                  <MenuItem value="Training">Training</MenuItem>
                </Select>
              </FormControl>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Upload Race Image:
                </Typography>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </Box>
              <Button variant="contained" onClick={handleCreateRace}>
                Create Race
              </Button>
              {formMessage && (
                <Typography variant="body2" color="text.secondary">
                  {formMessage}
                </Typography>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Races;
