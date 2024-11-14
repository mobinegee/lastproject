import React, { useEffect, useState, useRef } from 'react';
import styles from './SearchExplore.module.css';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faFilm, faHouse, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import Tabs from '../../Components/Tebs/Tabs';

export default function SearchExplore() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null); // مرجع برای input

  // تنظیم فوکوس ورودی در بارگذاری صفحه
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleProfileNavigation = (username) => {
    navigate(`/ProfileOther/${username}`);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        try {
          const response = await fetch(`https://p56x7f-5200.csb.app/api/users/search?name=${query}`);
          if (response.ok) {
            const data = await response.json();
            setResults(data);
          } else {
            console.error('Error fetching search results');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        setResults([]);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Type to search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchBox}
        ref={inputRef} // اضافه کردن مرجع به input
      />
      <div className={styles.resultsContainer}>
        {results.map((item) => (
          <div
            key={item.id}
            className={styles.resultItem}
            onClick={() => handleProfileNavigation(item.username)}
          >
            {item.username}
          </div>
        ))}
      </div>
      <div className="tabs">
        <Tabs />
      </div>
    </div>
  );
}
