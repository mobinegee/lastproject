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
            <Route path="/lastproject" element={<Explore />} />
            <Route path="/lastproject/Chats" element={<Chats />} />
            <Route path="/lastproject/ProfileExplore" element={<ProfileExplore />} />
            <Route path="/lastproject/PostExplore" element={<PostExplore />} />
            <Route path="/lastproject/SerachExplore" element={<SerachExplore />} />
            <Route path="/lastproject/ChatsOther/:groupName" element={<ChatsOther />} />
            <Route path="/lastproject/ProfileOther/:username" element={<ProfileOther />} />
            <Route path="/lastproject/GroupPage" element={<GroupPage />} />
            <Route path="/lastproject/ExplorePost" element={<ExplorePost />} />
            <Route path="/lastproject/EditProfile" element={<EditProfile />} />
            <Route path="/lastproject/GroupName/:groupName" element={<GroupName />} />
            <Route path="/lastproject/PostsSlider" element={<PostsSlider />} />
            <Route path="/lastproject/Profilesetting" element={<Profilesetting />} />
          </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
