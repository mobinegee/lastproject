import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/Context';
import Loading from '../../Components/Loading/Loading';
import './ProfileExplore.css';
import Tabs from '../../Components/Tebs/Tabs';
import PostsSlider from '../PostsSlider/PostsSlider';

export default function ProfileExplore() {
    const navigate = useNavigate();
    const { userInfo } = useTheme();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(null); // حالت اولیه برای اسلایدر
    const { statesound, setstatesound, isMuted, setIsMuted } = useTheme();  // به درستی از شیء استفاده کنید
    const videoRefs = useRef([]); // مرجع ویدیوها
    const [imfollowing, setimfollowing] = useState(0)
    const [followersCount, setFollowersCount] = useState(0); // اضافه کردن تعداد دنبال‌کننده‌ها

    useEffect(() => {
        if (userInfo?.id) {
            // درخواست برای دریافت تعداد فالوور‌ها
            fetch(`https://p56x7f-5200.csb.app/api/users/followersCount?id=${userInfo.id}`)
                .then(response => {
                    if (!response.ok) {
                        // اگر پاسخ 200 نباشد (خطای 500 یا دیگر خطاها)
                        throw new Error('Server error');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Followers count:', data.followersCount);
                    setFollowersCount(data.followersCount); // ذخیره تعداد فالوورها
                })
                .catch(error => {
                    console.error('Error fetching followers count:', error);
                    setFollowersCount(0); // در صورت خطا، تعداد فالوورها صفر می‌شود
                });
        }
    }, [userInfo]);


    const handleNavigation = (route) => {
        navigate(route);
    };
    console.log('userInfo =>', userInfo)
    console.log('statesound =>', statesound)
    // اضافه کردن رویدادهای لمسی
    let touchStartY = 0;  // ذخیره موقعیت Y شروع لمس
    let touchEndY = 0;    // ذخیره موقعیت Y پایان لمس

    const handleTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe(); // فراخوانی تابع تشخیص جهت
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
    useEffect(() => {
        if (userInfo && userInfo.id) {
            fetch(`https://p56x7f-5200.csb.app/api/users/imfollowing?id=${userInfo.id}`)
                .then(res => {
                    if (!res.ok) {
                        // اگر پاسخ 200 نباشد (خطای 500 یا دیگر خطاها)
                        throw new Error('Server error');
                    }
                    return res.json();
                })
                .then(result => {
                    console.log('Im following result =>', result);
                    setimfollowing(result.imfollowing);
                })
                .catch(error => {
                    console.error('Error fetching imfollowing:', error);
                    setFollowersCount(0); // در صورت خطا، تعداد فالوورها صفر می‌شود
                });
        }
    }, [userInfo]);

    // useEffect(() => {
    //     if (userInfo && userInfo.id) {
    //         fetch(`https://p56x7f-5200.csb.app/api/users/followersCount?id=${userInfo.id}`)
    //             .then(res => res.json()).then(result => {
    //                 console.log('im folower result =>', result)
    //                 // setfollowersCount(result.imfollowing)
    //             })
    //     }


    // }, [userInfo])


    useEffect(() => {
        if (userInfo && userInfo.id) {
            setIsLoading(true);  // نمایش حالت بارگذاری هنگام گرفتن داده‌ها
            fetch(`https://p56x7f-5200.csb.app/api/posts/posts/${userInfo.id}`)
                .then((response) => response.json())
                .then((data) => {
                    setPosts(data);
                    setIsLoading(false);
                    setCurrentIndex(null); // ریست کردن ایندکس بعد از بارگذاری پست‌ها
                })
                .catch((error) => {
                    console.error('خطا در گرفتن پست‌ها:', error);
                    setIsLoading(false);
                });
        }
    }, [userInfo]);

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


    const closeSlider = () => {
        setCurrentIndex(null); // بستن اسلایدر
    };

    console.log('posts =>', posts)
    const isUrl = (str) => /^(http|https):\/\//.test(str);

    return (
        <div style={{ direction: 'rtl' }}>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="profile-container">
                    <div className="profile-header">
                        <img
                            src={`${userInfo.image}`}
                            alt=""
                            className="profile-picture"
                        />
                        <div className="profile-info">
                            <div className="profile-stats">
                                <div className="stat">
                                    <h2>{posts.length}</h2>
                                    <span>پست‌ها</span>
                                </div>
                                <div className="stat">
                                    <h2>{followersCount}</h2>
                                    <span>دنبال کننده‌ها</span>
                                </div>
                                <div className="stat">
                                    <h2>{imfollowing}</h2>
                                    <span>دنبال می‌کنید</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile-bio" style={{ textAlign: 'right' }}>
                        <p>{userInfo.username}</p>
                        <p>{userInfo.bio}</p>
                        <div className="buttonsprofile">
                            <div><li onClick={() => handleNavigation('/Profilesetting')}>تنظیمات</li></div>
                            <div><li onClick={() => handleNavigation('/EditProfile')}>ویرایش پروفایل</li></div>
                            <div><li onClick={() => handleNavigation('/Settings')}>تنظیمات پیشرفته</li></div>
                        </div>
                    </div>
                    <div className="profile-posts">
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


                    </div>
                </div>
            )}

            {/* Slider Section */}
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
                        setposts={setPosts}
                        setIsMuted={setIsMuted}
                        isMuted={isMuted}
                    />
                </div>
            )}


            {/* Tabs Section */}
            <div className="tabs">
                <Tabs />
            </div>
        </div>
    );
}
