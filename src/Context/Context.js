import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [themes, setThemes] = useState('dark');
  const [ShowSignForm, setShowSignForm] = useState(false);
  const [authorization, setAuthorization] = useState('');
  const [userInfo, setUserInfo] = useState(null); // اطلاعات کاربر
  const [loading, setLoading] = useState(true);
  const [otherID, setotherID] = useState(null);
  const [followings, setFollowings] = useState([]); // لیست دنبال‌شدگان
  const [statesound, setstatesound] = useState(true);
  const [statesound1, setstatesound1] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // این Effect برای بررسی وضعیت توکن در LocalStorage در هنگام بارگذاری صفحه است.
  useEffect(() => {
    const savedAuthorization = localStorage.getItem('authorization');
    if (savedAuthorization) {
      setAuthorization(savedAuthorization);
    }
    setLoading(false);
  }, []); // فقط یک بار در هنگام بارگذاری اولیه اجرا می‌شود.

  useEffect(() => {
    if (authorization) {
      setIsLogin(true);
      fetch('https://p56x7f-5200.csb.app/api/users/userinfo', {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setUserInfo(data);
          setFollowings(data.followings || []);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
          setIsLogin(false);
          setLoading(false);
        });
    } else {
      setIsLogin(false);
      setLoading(false);
    }
  }, [authorization]);

  return (
    <ThemeContext.Provider value={{
      authorization,
      setAuthorization,
      ShowSignForm,
      setShowSignForm,
      themes,
      setThemes,
      isLogin,
      setIsLogin,
      userInfo, // ارسال اطلاعات کاربر به سایر کامپوننت‌ها
      loading,  // وضعیت لودینگ
      followings, // ارسال لیست دنبال‌شدگان
      setFollowings, // تابع تغییر لیست دنبال‌شدگان
      otherID,
      setotherID,
      statesound,
      setstatesound,
      statesound1,
      setstatesound1,
      isMuted,
      setIsMuted
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
