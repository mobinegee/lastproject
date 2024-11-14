

import React from 'react'
import './Profilesetting.css'
import { useNavigate } from 'react-router-dom';
import { faUser, faFilm, faHouse, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../../Components/Loading/Loading';
import { FaRegHeart, FaMoon, FaShareSquare, FaRegComment, FaRegBookmark } from 'react-icons/fa';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import Tabs from '../../Components/Tebs/Tabs';
export default function Profilesetting() {
  const navigate = useNavigate()
  function logout() {
    localStorage.removeItem('authorization');
    navigate('/')

  }
  const handleNavigation = (route) => {
    navigate(route);
  };
  return (
    <div>
      <button onClick={logout}>log out</button>
      <div className="tabs">
        <Tabs />
      </div>
    </div>
  )
}
