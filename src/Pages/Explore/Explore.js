import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../../Context/Context';
import Welcome from '../Welcome/Welcome';
import Tabs from '../../Components/Tebs/Tabs';
import './Explore.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { faUser, faFilm, faHouse, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../../Components/Loading/Loading';
import { FaRegHeart, FaMoon, FaShareSquare, FaRegComment, FaRegBookmark } from 'react-icons/fa';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa'; // اضافه کردن آیکون‌های صدا
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function Explore() {
    const { statesound1, setstatesound1 } = useTheme();  // به درستی از شیء استفاده کنید
    const { Themes, isLogin, setIsLogin, userInfo } = useTheme();
    const { t } = useTranslation();
    const language = localStorage.getItem('language');
    const [youAreFollowing, setYouAreFollowing] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [Idsfollowing, setIdsfollowing] = useState([]);
    const [Posts, setPosts] = useState([]);
    const [likes, setLikes] = useState({}); // ذخیره لایک‌ها
    const [likeCounts, setLikeCounts] = useState({}); // ذخیره تعداد لایک‌ها
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState({});
    const storyRef = useRef(null);
    const navigate = useNavigate();
    const postIds = Posts.map(post => post.post_id);
    const [countLikesandcomments, setCountLikesandcomments] = useState([])
    const videoRefs = useRef([]); // مرجع ویدیوها
    const [isMuted, setIsMuted] = useState(true); // وضعیت صدادار بودن یا نبودن ویدیوها
    const [mutedStatus, setMutedStatus] = useState({}); // وضعیت صدای هر ویدیو
    const [usersInfodata, setusersInfodata] = useState([])
    const prevPostIdsRef = useRef();
    const [commentsposts, setcommentsposts] = useState([])
    const prevPostIdsRef1 = useRef(JSON.stringify(postIds));
    const [imageusers, setimageusers] = useState([])
    const [ISlikepost, setISlikepost] = useState([])
    const [statecomment, setstatecomment] = useState([])
    const [stateLikes, setstateLikes] = useState([]); // مقداردهی اولیه به صورت آرایه خالی
    const [x, setX] = useState(0);  // مقدار اولیه x برابر با 0 است

    // بررسی وضعیت ورود کاربر
    console.log('explore is running')
    useEffect(() => {
        const auth = localStorage.getItem('authorization');
        setIsLogin(!!auth);
    }, []);
    console.log('Posts =>', Posts)

    // دریافت دنبال‌شدگان
    useEffect(() => {
        console.log('userInfo id =>', userInfo?.id)
        if (userInfo) {
            fetch(`https://p56x7f-5200.csb.app/api/users/following/${userInfo.id}`)
                .then(response => response.json())
                .then(data => {
                    console.log('data =>', data)
                    if (data) {
                        const followingIds = data.map(item => item);
                    console.log('followingIds =>' , followingIds)
                    setIdsfollowing(followingIds);

                    }
                })
                .catch(error => console.error('Error fetching following list:', error));
        }
        getUserImageById1()
    }, [userInfo]);

    useEffect(() => {
        console.log('postIds =>', postIds)
        // Make sure postIds have changed from the last value
        if (prevPostIdsRef.current !== postIds.join(',')) {  // Comparing as comma-separated string
            // console.log('postIds changed:', postIds);
            fetch(`https://p56x7f-5200.csb.app/api/posts/likes-comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_ids: postIds }),
            })
                .then(response => response.json())
                .then(data => {
                    const likesAndComments = data.reduce((acc, item) => {
                        acc[item.post_id] = {
                            likes: item.like_count,
                            comments: item.comment_count,
                        };
                        return acc;
                    }, {});
                    setCountLikesandcomments(likesAndComments);
                    // console.log('Likes and comments =>', likesAndComments);
                })
                .catch(error => {
                    console.error('Error fetching likes and comments:', error);
                });
        }
        prevPostIdsRef.current = postIds.join(',');
    }, [postIds]);

    useEffect(() => {
        if (userInfo && userInfo.id && Idsfollowing.length > 0) {
            fetch(`https://p56x7f-5200.csb.app/api/users/multiple`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_ids: Idsfollowing }),
            })
                .then(response => response.json())
                .then(data => {
                    setusersInfodata(data)
                })
                .catch(error => {
                    console.error('Error fetching user posts:', error);
                    setIsLoading(false);
                });
        }
    }, [Idsfollowing, userInfo]);

    useEffect(() => {
        fetch(`https://p56x7f-5200.csb.app/api/users/limeitedinfousers`)
            .then(res => res.json())
            .then(result => {
                setimageusers(result)
                // console.log('image users ->', result)
            })
    }, [])

    useEffect(() => {
        if (
            userInfo &&
            userInfo.id &&
            Array.isArray(postIds) &&
            postIds.length > 0 &&
            postIds.join(',') !== prevPostIdsRef1.current
        ) {
            prevPostIdsRef1.current = postIds.join(',');

            fetch(`https://p56x7f-5200.csb.app/api/posts/multiple-comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_ids: postIds }),
            })
                .then(response => response.json())
                .then(data => {
                    setcommentsposts(data);
                })
                .catch(error => {
                    console.error('Error fetching user posts:', error);
                });
        }
    }, [postIds, userInfo]);


    useEffect(() => {
        console.log('Idsfollowing =>', Idsfollowing)
        if (userInfo && userInfo.id && Idsfollowing.length > 0) {
            fetch(`https://p56x7f-5200.csb.app/api/posts/multiple`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_ids: Idsfollowing }),
            })
                .then(response => response.json())
                .then(data => {
                    setPosts(data);
                    const initialLikes = {};
                    const initialLikeCounts = {};

                    data.forEach(post => {
                        initialLikes[post.post_id] = post.isLiked; // بررسی اینکه آیا کاربر این پست را لایک کرده است
                        initialLikeCounts[post.post_id] = post.likesCount; // تعداد لایک‌های هر پست
                    });
                    setLikes(initialLikes);
                    setLikeCounts(initialLikeCounts);
                })
                .catch(error => {
                    console.error('Error fetching user posts:', error);
                });
        }
        setIsLoading(false);

    }, [Idsfollowing, userInfo]);

    // مدیریت ارسال کامنت
    const handleCommentChange = (postId, comment) => {
        setNewComment(prev => ({ ...prev, [postId]: comment }));
    };


    const handleCommentSubmit = (postId) => {
        const comment = newComment[postId] || ''; // If the comment is undefined, default it to an empty string

        // Check if the comment is not empty or just whitespace
        if (comment.trim() === '') return; // If the comment is empty, do not submit

        // Add the new comment to the local state immediately
        setComments(prevComments => ({
            ...prevComments,
            [postId]: [...(prevComments[postId] || []), comment], // Add the new comment to the list
        }));

        // Update the count of comments in countLikesandcomments immediately
        setCountLikesandcomments(prevCounts => ({
            ...prevCounts,
            [postId]: {
                ...prevCounts[postId],
                comments: (prevCounts[postId]?.comments || 0) + 1, // Increment comment count
            },
        }));

        // Reset the input field for this post
        setNewComment(prev => ({ ...prev, [postId]: '' }));

        // ارسال کامنت به سرور
        fetch(`https://p56x7f-5200.csb.app/api/posts/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('authorization'),
            },
            body: JSON.stringify({ post_id: postId, user_id: userInfo.id, comment_text: comment })
        })
            .then(response => response.json())
            .then(data => {
                // After sending, update the commentsposts state if necessary
                // This will ensure that new comments show up instantly
                setcommentsposts(prevComments => [
                    ...prevComments,
                    { post_id: postId, comment_text: comment, comment_id: data.comment_id, user_id: userInfo.id }
                ]);
            })
            .catch(error => {
                console.error('Error posting comment:', error);
            });
    };

    const handleVideoClick = () => {
        setstatesound1(!statesound1)
        const newMuteStatus = !isMuted;
        setIsMuted(newMuteStatus); // وضعیت صدا را به‌روزرسانی می‌کنیم

        // تنظیم صدای همه ویدیوها بر اساس وضعیت جدید
        videoRefs.current.forEach(video => {
            if (video) {
                video.muted = newMuteStatus;
            }
        });
    };

    // ویدیو
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.75 }
        );

        videoRefs.current.forEach(video => {
            if (video) observer.observe(video);
        });

        return () => {
            videoRefs.current.forEach(video => {
                if (video) observer.unobserve(video);
            });
        };
    }, [Posts]);

    function getUsernameById(userId) {
        const user = usersInfodata.find(user => user.id === userId);
        return user ? user.username : 'Unknown User';
    }

    useEffect(() => {
        if (usersInfodata) {
            setIsLoading(false);
        }
    }, [])

    function getUserImageById1(userId) {
        const user = usersInfodata.find(user => user.id === userId);
        return user && user.image ? user.image : '/uploads/user.png'; // تصویر پیش‌فرض جدید
    }
    function getUserImageById2(userId) {
        const user = imageusers.find(user => user.id === userId);
        return user && user.image ? user.image : '/uploads/user.png'; // تصویر پیش‌فرض جدید
    }
    function getUserImageById14(id) {
        // جستجو در آرایه بر اساس ID
        const user = usersInfodata.find(user => user.id === id);
        return user && user.image ? user.image : '/uploads/user.png'; // تصویر پیش‌فرض جدید
    }
    function gotoprogileOther(id) {
        console.log('id =>', id)
        const user = usersInfodata.find(user => user.id === id);
        navigate(`/ProfileOther/${user.username}`)
    }

    // گرفتن لایک کاربر ها
    useEffect(() => {
        fetch('https://p56x7f-5200.csb.app/api/posts/likesuser', {
            method: 'POST', // تغییر متد به POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userInfo?.id }) // ارسال اطلاعات به صورت JSON
        })
            .then(res => res.json())
            .then(result => {
                // console.log('result likes user =>', result);
                setISlikepost(result.map(item => item.post_id))
            })
            .catch(error => {
                console.error('Error:', error); // اضافه کردن مدیریت خطا
            });
    }, [userInfo, stateLikes]);

    // مدیریت دیس لایک کردن
    function handelDisLike(postID) {
        console.log('user_id =>', userInfo.id);
        console.log('post_id =>', postID);
        setX(-1);
        setstateLikes(prevState => prevState.filter(id => id !== postID));
    
        // ارسال درخواست به سرور برای حذف لایک
        fetch(`https://p56x7f-5200.csb.app/api/posts/unlike?user_id=${userInfo.id}&post_id=${postID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log('result likes user =>', result);
                setISlikepost(result.map(item => item.post_id));
            })
            .catch(error => {
                console.error('Error:', error); 
            });
    }
    
    // مدیریت لایک کردن
    const handleLike = (postId) => {
        setX(1)
        const isLiked = likes[postId];  // چک می‌کنیم که آیا پست قبلاً لایک شده است یا نه
        const updatedLikes = !isLiked;  // اگر لایک نشده باشد، لایک می‌کنیم و برعکس
        setstateLikes(prevState => [...prevState, postId]);


        // بروزرسانی وضعیت لایک‌ها در UI
        setLikes(prevLikes => ({
            ...prevLikes,
            [postId]: updatedLikes,  // تغییر وضعیت لایک برای پست مورد نظر
        }));

        // بروزرسانی تعداد لایک‌ها در UI
        setLikeCounts(prevCounts => ({
            ...prevCounts,
            [postId]: updatedLikes ? prevCounts[postId] + 1 : prevCounts[postId] - 1,  // افزایش یا کاهش تعداد لایک‌ها
        }));

        // ارسال درخواست به سرور برای لایک کردن یا حذف لایک
        fetch(`https://p56x7f-5200.csb.app/api/posts/like`, {
            method: updatedLikes ? 'POST' : 'DELETE',  // برای لایک از POST و برای حذف لایک از DELETE استفاده می‌شود
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('authorization'),  // ارسال توکن کاربر برای شناسایی
            },
            body: JSON.stringify({ post_id: postId, user_id: userInfo.id })  // ارسال اطلاعات پست و کاربر
        })
            .then(response => response.json())
            .then(() => {
                // اینجا می‌توانید اقداماتی مثل ریفرش داده‌ها از سرور یا هر کار دیگری انجام دهید
            })
            .catch(error => {
                console.error('Error liking post:', error);  // اگر خطا در ارسال درخواست به سرور پیش آمد
            });
    };



    return (
        <div
            className="explore-container"
            style={{
                color: Themes === 'dark' ? 'white' : 'black',
                backgroundColor: Themes === 'dark' ? 'black' : '',
                direction: 'rtl'

            }}
        >
            <div >
                {isLoading ? (
                    <Loading />
                ) : (
                    <div>
                        {isLogin ? (
                            <div>
                                <div className="header">
                                    <div><h1>{t('h1')}</h1></div>
                                    <div style={{ textAlign: language === 'fa' ? 'left' : 'right' }}>
                                        <li><FaRegHeart style={{ color: 'black', fontSize: '25px' }} /></li>
                                        <li><FaMoon style={{ color: 'black', fontSize: '25px' }} /></li>
                                    </div>
                                </div>
                                <div className="story" ref={storyRef}>
                                    <ul>
                                        {youAreFollowing.map(id => (
                                            <li key={id} onClick={() => gotoprogileOther(id)}>
                                                <img
                                                    className='imagestory'
                                                    src={`http://localhost:5200${getUserImageById14(id)}`}
                                                    alt=''
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {Posts.map((post, index) => (
                                    <div key={index} className="allpost">
                                        <div className="posts">
                                            <div className="image-container">
                                                {post.media_url && ['.mp4', '.webm', '.avi'].some(ext => post.media_url.endsWith(ext)) ? (
                                                    <video
                                                        ref={(el) => { videoRefs.current[index] = el; }}
                                                        muted={mutedStatus[index] !== false}
                                                        width="100%"
                                                        loop
                                                    >
                                                        <source src={post.media_url} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <img className='imagepost' src={`${post.image}`} alt={post.caption} />
                                                )}
                                                <div className="blue-circle">
                                                    <img
                                                        onClick={() => gotoprogileOther(post.user_id)}
                                                        src={`http://localhost:5200${getUserImageById1(post.user_id)}`}
                                                        alt={`${post.user_name}'s profile`}
                                                    />
                                                </div>
                                                <div className='yellow-circle' >
                                                    <h3 onClick={() => gotoprogileOther(post.user_id)}>{getUsernameById(post.user_id)}</h3>
                                                </div>
                                                <div className='green-circle' onClick={() => handleVideoClick(index)}>
                                                    {statesound1 === false ? (
                                                        <FaVolumeMute style={{ color: 'gray', fontSize: '25px' }} />
                                                    ) : (
                                                        <FaVolumeUp style={{ color: 'green', fontSize: '25px' }} />
                                                    )}
                                                </div>
                                                <div className="abzar">
                                                    <ul>
                                                        {
                                                            stateLikes.includes(post.post_id) ? (
                                                                <>
                                                                    <li>
                                                                        {/* <FontAwesomeIcon onClick={() => handelDisLike(post.post_id)}
                                                                            icon={faHeart} style={{ color: '#e01010', fontSize: '25px' }} /> */}
                                                                        <video autoPlay src="images/heart1.mp4" className='gif'></video>
                                                                    </li>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {
                                                                        ISlikepost.includes(post.post_id) ? (
                                                                            <>
                                                                                <li>
                                                                                    <FontAwesomeIcon onClick={() => handelDisLike(post.post_id)}
                                                                                        icon={faHeart} style={{ color: '#e01010', fontSize: '25px' }} />
                                                                                </li>                                                                </>
                                                                        ) : (
                                                                            <>
                                                                                <li onClick={() => handleLike(post.post_id)}>
                                                                                    <FaRegHeart
                                                                                        style={{
                                                                                            color: 'black',
                                                                                            fontSize: '25px',
                                                                                        }}
                                                                                    />
                                                                                </li>
                                                                            </>
                                                                        )
                                                                    }
                                                                </>
                                                            )
                                                        }
                                                        <li><FaRegComment style={{ color: 'black', fontSize: '25px' }} /></li>
                                                        <li><FaShareSquare style={{ color: 'black', fontSize: '25px' }} /></li>
                                                        <li><FaRegBookmark style={{ color: 'black', fontSize: '25px' }} /></li>
                                                    </ul>
                                                    <div className="other">
                                                        {stateLikes.includes(post.post_id) ? (
                                                            <>
                                                                <h4>{(countLikesandcomments[post.post_id]?.likes || 0) + x} likes</h4>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <h4>{(countLikesandcomments[post.post_id]?.likes || 0)} likes</h4>
                                                            </>
                                                        )}

                                                        <h4>{countLikesandcomments[post.post_id]?.comments || 0} comments</h4>
                                                        <h4>{post.caption}</h4>
                                                        {/* <h4>{post.post_id}</h4> */}
                                                        {/* <p>{post.comments ? post.comments.length : 0} comments</p> */}
                                                        <p>{post.timeAgo}</p>
                                                    </div>
                                                    <div className="comments-section">
                                                        {
                                                            commentsposts
                                                                .filter(comment => comment.post_id === post.post_id) // فیلتر کردن کامنت‌ها بر اساس post_id
                                                                .reverse() // معکوس کردن آرایه کامنت‌ها
                                                                .map(filteredComment => (
                                                                    <div key={filteredComment.comment_id}>
                                                                        <img
                                                                            src={`http://localhost:5200${getUserImageById2(filteredComment.user_id)}`}
                                                                            alt="Description" style={{ marginRight: '10px', width: '30px', height: '30px' }} />
                                                                        <h4>{filteredComment.comment_text}</h4>
                                                                    </div>
                                                                ))
                                                        }
                                                    </div>
                                                    <div className='text-explore'>
                                                        <input
                                                            className='inputExplore'
                                                            type="text"
                                                            placeholder="Write a comment..."
                                                            value={newComment[post.post_id] || ''}
                                                            onChange={(e) => handleCommentChange(post.post_id, e.target.value)}
                                                        />
                                                        <button onClick={() => handleCommentSubmit(post.post_id)}>ارسال</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="tabs">
                                    <Tabs />
                                </div>
                            </div>
                        ) : (
                            <Welcome />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


