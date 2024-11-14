import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Group.css';
import { useTheme } from '../../Context/Context';
import { useNavigate } from 'react-router-dom';

const socket = io("ws://p56x7f-5200.csb.app", {
  transports: ["websocket"],
  secure: true,
});

socket.on("connect", () => {
  console.log("به سرور WebSocket متصل شد");
});

socket.on("disconnect", () => {
  console.log("از سرور WebSocket قطع شد");
});


const GroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [usersInGroup, setUsersInGroup] = useState([]);
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const { userInfo } = useTheme();
  const userId = userInfo?.id;
  const Navigate = useNavigate()
  useEffect(() => {
    if (userId && groupName) {
      socket.emit('join-room', groupName);
    }

    // دریافت پیام‌های جدید از گروه
    socket.on('roomMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // دریافت کاربران گروه
    socket.on('roomUsers', (users) => {
      setUsersInGroup(users);
    });

    return () => {
      socket.off('roomMessage');
      socket.off('roomUsers');
    };
  }, [userId, groupName]);

  function handleJoinGroup() {
    Navigate(`/GroupName/${groupName}`);
  };

  // تابع برای جستجو در گروه‌ها
  const handleGroupSearch = (e) => {
    const searchTerm = e.target.value;
    setGroupName(searchTerm); // برای کنترل فیلد ورودی

    if (searchTerm) {
      fetch(`https://p56x7f-5200.csb.app/api/chats/search-groups?groupName=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
          setGroupSearchResults(data); // نمایش گروه‌های پیدا شده
        })
        .catch((error) => {
          console.error('Error searching for groups:', error);
        });
    } else {
      setGroupSearchResults([]); // اگر فیلد جستجو خالی است، نتایج را پاک کن
    }
  };



  return (
    <div className="group-page">
      <div className="group-info">
        <h2>Welcome to the Group!</h2>
        <input
          type="text"
          placeholder="Search for a Group"
          value={groupName}
          onChange={handleGroupSearch}  // جستجو در گروه‌ها
        />
        <div className="group-search-results">
          {groupSearchResults.length > 0 ? (
            <ul>
              {groupSearchResults.map((group) => (
                <li key={group.id} onClick={() => setGroupName(group.name)}>
                  {group.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No groups found</p>
          )}
        </div>
        <button onClick={handleJoinGroup}>Join group</button>
      </div>
    </div>
  );
};

export default GroupPage;
