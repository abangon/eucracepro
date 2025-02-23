import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // убедитесь, что здесь импортирована ваша конфигурация Firestore
import ReactCountryFlag from 'react-country-flag';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // Загрузка данных из Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList = usersSnapshot.docs.map(doc => doc.data());
        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
      }
    };

    fetchUsers();
  }, []);

  // Фильтрация пользователей по имени и стране
  useEffect(() => {
    let filtered = users;
    if (nameFilter) {
      filtered = filtered.filter(user =>
        user.nickname && user.nickname.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (countryFilter) {
      filtered = filtered.filter(user =>
        user.country === countryFilter
      );
    }
    setFilteredUsers(filtered);
  }, [nameFilter, countryFilter, users]);

  // Формируем список уникальных стран для выпадающего меню
  const countries = Array.from(new Set(users.map(user => user.country).filter(Boolean)));

  return (
    <div style={{ padding: '1rem' }}>
      {/* Фильтры */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Filter by Name"
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <select
          value={countryFilter}
          onChange={e => setCountryFilter(e.target.value)}
          style={{ padding: '0.5rem' }}
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Таблица участников */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>Nickname</th>
            <th style={{ padding: '0.5rem' }}>Team</th>
            <th style={{ padding: '0.5rem' }}>Country</th>
            <th style={{ padding: '0.5rem' }}>Facebook</th>
            <th style={{ padding: '0.5rem' }}>Instagram</th>
            <th style={{ padding: '0.5rem' }}>Youtube</th>
            <th style={{ padding: '0.5rem' }}>Tiktok</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{user.nickname || '–'}</td>
              <td style={{ padding: '0.5rem' }}>{user.team || '–'}</td>
              <td style={{ padding: '0.5rem' }}>
                {user.country ? (
                  <ReactCountryFlag
                    countryCode={user.country}
                    svg
                    style={{ width: '2em', height: '2em' }}
                    title={user.country}
                  />
                ) : '–'}
              </td>
              <td style={{ padding: '0.5rem' }}>
                {user.facebook ? (
                  <a href={user.facebook} target="_blank" rel="noopener noreferrer">
                    <FaFacebook size={20} />
                  </a>
                ) : '–'}
              </td>
              <td style={{ padding: '0.5rem' }}>
                {user.instagram ? (
                  <a href={user.instagram} target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={20} />
                  </a>
                ) : '–'}
              </td>
              <td style={{ padding: '0.5rem' }}>
                {user.youtube ? (
                  <a href={user.youtube} target="_blank" rel="noopener noreferrer">
                    <FaYoutube size={20} />
                  </a>
                ) : '–'}
              </td>
              <td style={{ padding: '0.5rem' }}>
                {user.tiktok ? (
                  <a href={user.tiktok} target="_blank" rel="noopener noreferrer">
                    <FaTiktok size={20} />
                  </a>
                ) : '–'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
