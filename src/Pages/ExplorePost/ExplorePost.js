import React, { useEffect, useRef, useState } from 'react';
import styles from './ExplorePost.module.css';
import { faUser, faFilm, faHouse, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import Tabs from '../../Components/Tebs/Tabs';
import PostsSlider from '../PostsSlider/PostsSlider';
import { useTheme } from '../../Context/Context';

export default function SearchExplore() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const handleNavigation = (route) => {
        navigate(route);
    };

    const handleFocus = () => {
        navigate('/SerachExplore');
    };


    return (
        <div className={styles.container}>
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Type to search..."
                value={query}
                onFocus={handleFocus}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchBox}
            />

            {/* Posts and Videos Grid */}
            <PostGrid />

            {/* Tabs (bottom navigation bar) */}
            <div className="tabs">
                <Tabs />
            </div>
        </div>
    );
}


// Component to display the grid of posts and videos
function PostGrid() {
    const [currentIndex, setCurrentIndex] = useState(null); // حالت اولیه برای اسلایدر
    const [posts, setposts] = useState([])
    const { statesound, setstatesound, isMuted, setIsMuted } = useTheme();  // به درستی از شیء استفاده کنید
    const videoRefs = useRef([]); // مرجع ویدیوها

    useEffect(() => {
        fetch('https://p56x7f-5200.csb.app/api/posts/getallpost').then(res => res.json())
            .then(result => {
                console.log('result =>', result)
                setposts(result)
            })
    }, [])
    const goToNext = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % posts.length;
            const video = videoRefs.current[newIndex];
            if (video) {
                video.play(); // پخش ویدیو جدید
            }
            return newIndex;
        });
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex === 0 ? posts.length - 1 : prevIndex - 1);
            const video = videoRefs.current[newIndex];
            if (video) {
                video.play(); // پخش ویدیو جدید
            }
            return newIndex;
        });
    };

    const openInSlider = (index) => {
        setCurrentIndex(index);
        console.log("Current Post ID:", posts[index].post_id); // نمایش ID پست در کنسول
    };

    const handleSwipe = () => {
        const swipeDistance = touchEndY - touchStartY;
        if (swipeDistance > 50) {
            // حرکت به پایین (پست قبلی)
            goToPrevious();
        } else if (swipeDistance < -50) {
            // حرکت به بالا (پست بعدی)
            goToNext();
        }
    };

    let touchStartY = 0;  // ذخیره موقعیت Y شروع لمس
    let touchEndY = 0;    // ذخیره موقعیت Y پایان لمس
    const handleTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe(); // فراخوانی تابع تشخیص جهت
    };
    return (
        <div className={styles.postGrid}>
            {posts.map((post, index) => (
                <div className="post" key={post.post_id} onClick={() => openInSlider(index)}>
                    {post.media_url && ['.mp4', '.webm', '.avi'].some(ext => post.media_url.endsWith(ext)) ? (
                        <video className="videopost" height="200" width="auto">
                            <source src={post.media_url} type={`video/${post.media_url.split('.').pop()}`} />
                            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                        </video>
                    ) : (
                        <img src={post.image} alt={`Post ${post.post_id}`} />
                    )}
                </div>
            ))}
            {currentIndex !== null && (
                <div
                    className="aligen1"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <PostsSlider
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        posts={posts}
                        setposts={setposts}
                        setIsMuted={setIsMuted}
                        isMuted={isMuted}
                    />
                </div>
            )}
        </div>
    );
}
