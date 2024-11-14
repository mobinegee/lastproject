import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Tabs.css';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareInstagram } from '@fortawesome/free-brands-svg-icons';
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { faUser, faFilm, faHouse, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
export default function Tabs() {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="tabs-explore">
    <ul>
      <li onClick={() => handleNavigation('/')}><FontAwesomeIcon icon={faHouse} style={{ color: 'black', fontSize: '25px' }} /></li>
      <li onClick={() => handleNavigation('/PostExplore')}><FontAwesomeIcon icon={faPlus} style={{ color: 'black', fontSize: '25px' }} /></li>
      <li onClick={() => handleNavigation('/ExplorePost')}><FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: 'black', fontSize: '25px' }} /></li>
      <li onClick={() => handleNavigation('/Chats')}><FontAwesomeIcon icon={faTelegram} style={{ color: 'black', fontSize: '25px' }} /></li>
      <li onClick={() => handleNavigation('/ProfileExplore')}><FontAwesomeIcon icon={faUser} style={{ color: 'black', fontSize: '25px' }} /></li>
    </ul>
  </div>
  );
}
