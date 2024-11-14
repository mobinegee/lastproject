import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../Context/Context';
import Tabs from '../../Components/Tebs/Tabs'
import './ChatsOther.css'; // فایل استایل را اضافه کنید

let socket;

export default function ChatsOther() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { groupName } = useParams();
  const { userInfo } = useTheme();
  const [NameOther, setNameOther] = useState(null);
  const sender = userInfo?.id;
  const receiver = localStorage.getItem('otherID');

  console.log('messages =>', messages)
  console.log('receiver =>', receiver)

  useEffect(() => {
    fetch('https://p56x7f-5200.csb.app/api/users/getnamesusers', {
      method: 'POST', // استفاده از POST برای ارسال داده
      headers: {
        'Content-Type': 'application/json' // تنظیم نوع محتوا
      },
      body: JSON.stringify({ id: receiver }) // ارسال داده به صورت JSON
    })
      .then(res => res.json())
      .then(result => {
        console.log('names users =>', result.username)
        setNameOther(result.username)
        console.log('NameOther =>', NameOther)
      })
      .catch(error => console.error('Error fetching user names:', error));
  }, []);



  useEffect(() => {
    if (!socket) {
      socket = io('https://p56x7f-5200.csb.app/');
    }

    socket.emit('join_group', groupName);

    socket.on('initial_messages', (existingMessages) => {
      setMessages(existingMessages);
    });

    const handleMessageReceive = (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    socket.on('receive_message', handleMessageReceive);

    return () => {
      socket.emit('leave_group', groupName);
      socket.off('receive_message', handleMessageReceive);
    };
  }, [groupName]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message_pv', { groupName, sender, message, receiver });
      setMessage('');
    }
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <div className="chat-container1">
        <h2 className="chat-header">{NameOther}</h2>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender_id === sender ? 'chat-message-sent' : 'chat-message-received'}`}>
              <strong>{msg.sender_id === sender}</strong>{msg.content}
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="پیام خود را وارد کنید"
            className="chat-input"
          />
          <button onClick={sendMessage} className="chat-send-button">ارسال</button>
        </div>

        <div className="tabs">
          <Tabs />
        </div>
      </div>
    </div>
  );
}
