import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Explore from './Pages/Explore/Explore';
import Chats from './Pages/Chats/Chats';
import { ThemeProvider } from './Context/Context';
import { useEffect } from 'react';
import ProfileExplore from './Pages/profileExplore/profileExplore';
import PostExplore from './Pages/PostExplore/PostExplore';
import Profilesetting from './Pages/Profilesetting/Profilesetting';
import SerachExplore from './Pages/SerachExplore/SerachExplore';
import ProfileOther from './Pages/ProfileOther/ProfileOther';
import ChatsOther from './Pages/ChatsOther/ChatsOther';
import GroupPage from './Pages/Group/Group';
import GroupName from './Pages/GroupName/GroupName';
import ExplorePost from './Pages/ExplorePost/ExplorePost';
import EditProfile from './Pages/EditProfile/EditProfile';
import PostsSlider from './Pages/PostsSlider/PostsSlider';

function App() {
  useEffect(() => {
    // خواندن زبان از localStorage
    const language = localStorage.getItem('language') || 'en';
    // تنظیم جهت
    document.body.style.direction = language === 'en' ? 'ltr' : 'rtl';
  }, []); // این شرط فقط یک بار هنگام لود شدن اجرا می‌شود


  return (
    <ThemeProvider>
      <Router>
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/Chats" element={<Chats />} />
            <Route path="/ProfileExplore" element={<ProfileExplore />} />
            <Route path="/PostExplore" element={<PostExplore />} />
            <Route path="/SerachExplore" element={<SerachExplore />} />
            <Route path="/ChatsOther/:groupName" element={<ChatsOther />} />
            <Route path="/ProfileOther/:username" element={<ProfileOther />} />
            <Route path="/GroupPage" element={<GroupPage />} />
            <Route path="/ExplorePost" element={<ExplorePost />} />
            <Route path="/EditProfile" element={<EditProfile />} />
            <Route path="/GroupName/:groupName" element={<GroupName />} />
            <Route path="/PostsSlider" element={<PostsSlider />} />
            <Route path="/Profilesetting" element={<Profilesetting />} />
          </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
