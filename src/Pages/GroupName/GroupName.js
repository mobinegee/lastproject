import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../Context/Context';
import './GroupName.css'
import Tabs from '../../Components/Tebs/Tabs';
let socket;  // تعریف سوکت خارج از کامپوننت برای جلوگیری از چندین بار اتصال

export default function ChatComponent() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { groupName } = useParams();
  const { userInfo } = useTheme();
  const sender = userInfo?.id

  useEffect(() => {
    // اتصال به سوکت و پیوستن به گروه تنها یک بار در اولین بار استفاده
    if (!socket) {
      socket = io('https://p56x7f-5200.csb.app');
    }

    // پیوستن به گروه
    socket.emit('join_group', groupName);

    // دریافت پیام‌های موجود از سرور هنگام پیوستن به گروه
    socket.on('initial_messages', (existingMessages) => {
      setMessages(existingMessages);
    });

    // دریافت پیام جدید از سرور و اضافه کردن به لیست پیام‌ها
    const handleMessageReceive = (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };
    
    // اضافه کردن رویداد پیام تنها یک بار
    socket.on('receive_message', handleMessageReceive);

    // ترک گروه هنگام خاموش شدن کامپوننت
    return () => {
      socket.emit('leave_group', groupName);
      socket.off('receive_message', handleMessageReceive);  // حذف رویداد برای جلوگیری از تکرار
    };
  }, [groupName]);

  const sendMessage = () => {
    if (message.trim()) {
      // ارسال پیام به سرور
      socket.emit('send_message', { groupName, sender, message });
      setMessage(''); // پاک کردن فیلد ورودی بعد از ارسال پیام
    }
  };

  return (
    <div style={{direction: 'rtl'}}>
      <div className="chat-container1">
        <h2 className="chat-header">{groupName}</h2>

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
