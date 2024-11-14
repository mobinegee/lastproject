import React, { useEffect, useState } from 'react';
import styles from './Chats.module.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/Context';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tabs from '../../Components/Tebs/Tabs';

export default function SearchExplore() {
  const [chatUsers, setChatUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const { userInfo } = useTheme();
  const [groupnew, setGroupnew] = useState('');
  const { otherID, setotherID } = useTheme();
  const [resultusers, setResultUsers] = useState([]);
  const userIds = resultusers.map(user => user.user_id);
  const myID = userInfo?.id;
  const [userschat, setUsersChat] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // حالت برای باز و بسته کردن مودال
  const [reaultsusers, setreaultsusers] = useState([])
  const [reaultsgroups, setreaultsgroups] = useState([])
  
  const addGroup = () => {
    if (groupnew.trim()) {
      fetch(`https://p56x7f-5200.csb.app/api/group/add-group`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupnew }),
      }).then(res => res.json()).then(result => console.log('result => ', result));
      setGroupnew('');
      navigate(`/GroupName/${groupnew}`);
      setIsModalOpen(false); // بستن مودال پس از ایجاد گروه
    }
  };

  const createUniqueId = (id1, id2) => {
    const [a, b] = id1 < id2 ? [id1, id2] : [id2, id1];
    const uniqueId = (a + b) ** 2 + (a * b) + Math.abs(a - b);
    setotherID(id1);
    localStorage.setItem('otherID' , id1)
    return uniqueId;
  };


  // useEffect(() => {
  //   const fetchChatUsers = async () => {
  //     try {
  //       const response = await fetch(`https://p56x7f-5200.csb.app/api/group/get-chat-users?userId=${myID}`);
  //       if (response.ok) {
  //         const data = await response.json();
  //         setResultUsers(data);
  //       } else {
  //         console.error('Error fetching chat users');
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };

  //   fetchChatUsers();
  // }, [myID]);

  // useEffect(() => {
  //   if (userInfo && userInfo.id > 0 && Array.isArray(resultusers) && resultusers.length > 0) {
  //     fetch(`https://p56x7f-5200.csb.app/api/group/multiple`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ user_ids: userIds }),
  //     })
  //       .then(res => {
  //         if (!res.ok) {
  //           throw new Error('Network response was not ok');
  //         }
  //         return res.json();
  //       })
  //       .then(result => setUsersChat(result))
  //       .catch(error => console.error('Fetch error:', error));
  //   }
  // }, [userInfo, resultusers]);

  useEffect(() => {
    const fetchResults = async () => {
      // If query is not empty, perform search
      if (query) {
        try {
          const response = await fetch(`https://p56x7f-5200.csb.app/api/users/search-users?name=${query}`);
          if (response.ok) {
            const data = await response.json();
            // Check if data is an array and update state accordingly
            setreaultsusers(data.users);
            console.log('data users and group =>', data);
          } else {
            console.error('Error fetching search results');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        // Reset results if query is empty
        setreaultsusers([]);
      }
    };
  
    fetchResults();
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      // If query is not empty, perform search
      if (query) {
        try {
          const response = await fetch(`https://p56x7f-5200.csb.app/api/users/search-groups?name=${query}`);
          if (response.ok) {
            const data = await response.json();
            setreaultsgroups(data.users);
            console.log('data users and group =>', data);
          } else {
            console.error('Error fetching search results');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        // Reset results if query is empty
        setreaultsgroups([]);
      }
    };
  
    fetchResults();
  }, [query]);
  

  console.log('reaultsgroups =>', reaultsgroups)
  console.log('reaultsusers =>', reaultsusers)


  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Type to search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchBox}
      />
      {
        reaultsgroups.length > 0 || reaultsusers.length > 0 ? (
          <>
            <div className={styles.resultsContainer}>
              {(reaultsusers.length > 0 || reaultsgroups.length > 0) ? (
                <div>
                  {reaultsusers.length > 0 && (
                    <div>
                      <h4>کاربران</h4>
                      {reaultsusers.map(user => (
                        <div key={user.id}
                          className={styles.chatItem}
                          onClick={() => navigate(`/ChatsOther/${createUniqueId(user.id, myID)}`)}
                        >{user.username}</div>
                      ))}
                    </div>
                  )}

                  {reaultsgroups.length > 0 && (
                    <div>
                      <h4>گروه ها </h4>
                      {reaultsgroups.map(item => (
                        <div key={item.id}
                          className={styles.chatItem}
                          onClick={() => navigate(`/GroupName/${item.name}`)}
                        >{item.name}</div>
                      ))}
                    </div>
                  )}
                </div>

              ) : (
                <>
                  <p>No results found.</p>
                </>
              )}

            </div>
          </>
        ) : (<></>)
      }
      <h2>Chat Users</h2>
      <div className={styles.chatList}>
        {userschat.length > 0 ? (
          userschat.map((user) => (
            <div
              key={user.id}
              className={styles.chatItem}
              onClick={() => navigate(`/ChatsOther/${createUniqueId(user.id, myID)}`)}
            >
              {user.username}
            </div>
          ))
        ) : (
          <p>No chat users found.</p>
        )}
      </div>
      <div className="tabs">
        <Tabs />
      </div>

      {/* Floating button for adding a new group */}
      <div
        className={styles.addGroupButton}
        onClick={() => setIsModalOpen(true)} // باز کردن مودال
      >
        <FontAwesomeIcon icon={faPlus} />
      </div>

      {/* Modal for adding a new group */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Enter group name"
              value={groupnew}
              onChange={(e) => setGroupnew(e.target.value)}
              className={styles.groupInput}
            />
            <button onClick={addGroup} className={styles.addButton}>Create Group</button>
          </div>
        </div>
      )}
    </div>
  );
}
