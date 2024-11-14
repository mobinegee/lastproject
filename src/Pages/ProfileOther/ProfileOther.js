import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../Context/Context';
import Loading from '../../Components/Loading/Loading';
import './ProfileOther.css';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faFilm, faHouse, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tabs from '../../Components/Tebs/Tabs';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import PostsSlider from '../PostsSlider/PostsSlider';

export default function ProfileOther() {
    const navigate = useNavigate();
    const { userInfo } = useTheme(); // دسترسی به اطلاعات از context
    const [posts, setPosts] = useState([]);
    const [userInfoLoaded, setUserInfoLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { username } = useParams();
    const [infouserother, setinfouserother] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0); // اضافه کردن تعداد دنبال‌کننده‌ها
    const [followingCount, setFollowingCount] = useState(0); // اضافه کردن تعداد دنبال‌شده‌ها
    const userinfoID = userInfo?.id;
    const [youarefolowin, setyouarefolowingg] = useState([]); // اصلاح به آرایه خالی
    const [currentIndex, setCurrentIndex] = useState(null); // حالت اولیه برای اسلایدر
    const { statesound, setstatesound, isMuted, setIsMuted } = useTheme();  // به درستی از شیء استفاده کنید
    const videoRefs = useRef([]); // مرجع ویدیوها
    console.log('userinfoID =>', userinfoID)

    const handleNavigation = (route) => {
        navigate(route);
    };

    // دریافت اطلاعات کاربر و پست‌ها
    useEffect(() => {
        if (username) {
            // بارگذاری اطلاعات کاربر
            fetch(`https://p56x7f-5200.csb.app/api/users/user/${username}`)
                .then(res => res.json())
                .then(data => {
                    setinfouserother(data);
                    setPosts(data.posts || []);
                    setUserInfoLoaded(true);

                    // دریافت تعداد دنبال‌کننده‌ها و دنبال‌شده‌ها
                    setFollowersCount(data.followersCount || 0);
                    setFollowingCount(data.followingCount || 0);

                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setIsLoading(false);  // در صورت بروز خطا، لودینگ خاموش می‌شود
                });
        }
    }, [username]); // وابسته به username

    useEffect(() => {
        if (infouserother?.id) {
            // درخواست برای دریافت پست‌ها
            fetch(`https://p56x7f-5200.csb.app/api/posts/posts/${infouserother.id}`)
                .then(response => response.json())
                .then(data => {
                    setPosts(data);
                })
                .catch(error => {
                    console.error('Error fetching user posts:', error);
                });

            // درخواست برای دریافت تعداد فالوور‌ها
        }
    }, [infouserother]);

    useEffect(() => {
        if (infouserother?.id) {
            // درخواست برای دریافت تعداد فالوور‌ها
            fetch(`https://p56x7f-5200.csb.app/api/users/followersCount?id=${infouserother.id}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Followers count:', data.followersCount);
                    setFollowersCount(data.followersCount); // ذخیره تعداد فالوورها
                })
                .catch(error => {
                    console.error('Error fetching followers count:', error);
                });
        }
    }, [infouserother]);

    useEffect(() => {
        if (userInfo?.id) {  // اگر اطلاعات کاربر موجود باشد
            // درخواست برای دریافت دنبال‌شدگان شما
            fetch(`https://p56x7f-5200.csb.app/api/users/imfollowing?id=${userInfo.id}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Users you are following:', data);
                    setyouarefolowingg(data.map(follow => follow.following_id)); // فقط id‌های فالو شده
                })
                .catch(error => {
                    console.error('Error fetching following list:', error);
                });
        }
    }, [userInfo]); // وابسته به اطلاعات کاربر

    // تابع فالو یا آنفالو کردن کاربر
    const handleFollowToggle = () => {
        if (!userInfo || !infouserother) {
            console.error("User info or target user info is missing");
            return;
        }

        const followAction = isFollowing ? 'unfollow' : 'follow';

        setIsLoading(true);

        fetch(`https://p56x7f-5200.csb.app/api/users/${followAction}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authorization')}`
            },
            body: JSON.stringify({
                currentUserId: userinfoID, // id کاربر جاری
                targetUserId: infouserother?.id, // id کاربر هدف
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error following/unfollowing");
                }
                return response.json();
            })
            .then(data => {
                setIsFollowing(!isFollowing); // تغییر وضعیت فالو/آنفالو
                if (isFollowing) {
                    setFollowersCount(followersCount - 1); // اگر آنفالو است، تعداد دنبال‌کننده‌ها را کاهش بده
                } else {
                    setFollowersCount(followersCount + 1); // اگر فالو است، تعداد دنبال‌کننده‌ها را افزایش بده
                }

                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error following/unfollowing:", error);
                setIsLoading(false);
            });
    };
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
    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="profile-container">
                    <div className="profile-header">
                        <img src="images/2.jpeg" alt="Profile Picture" className="profile-picture" />
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
                                    <h2>{followingCount}</h2>
                                    <span>دنبال می‌کنید</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile-bio">
                        <p>{infouserother?.username}</p>
                        <p>این بیوگرافی کاربر است. می‌توانید اطلاعات بیشتری درباره کاربر در اینجا بنویسید.</p>
                        <button onClick={handleFollowToggle} disabled={isLoading}>
                            {/* بررسی فالو بودن یا نه */}
                            {youarefolowin.includes(infouserother.id) ? (
                                <button>Unfollow</button>
                            ) : (
                                <button>Follow</button>
                            )}
                        </button>
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
            <div className="tabs">
                <Tabs />
            </div>
        </div>
    );
}
