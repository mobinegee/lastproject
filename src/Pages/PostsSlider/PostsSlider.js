import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './PostsSlider.css';
import React, { useEffect, useRef, useState } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { useTheme } from '../../Context/Context';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FaRegHeart, FaMoon, FaShareSquare, FaRegComment, FaRegBookmark } from 'react-icons/fa';
import { faTimes } from '@fortawesome/free-solid-svg-icons';  // اضافه کردن آیکون faTimes
import { useNavigate } from 'react-router-dom';

export default function PostsSlider({ isMuted, setIsMuted, currentIndex, setCurrentIndex, posts, setposts }) {
    const videoRefs = useRef([]); // مرجع ویدیوها
    const { statesound, setstatesound, userInfo } = useTheme();  // به درستی از شیء استفاده کنید
    const [likeCounts, setLikeCounts] = useState({}); // ذخیره تعداد لایک‌ها
    const [Idsfollowing, setIdsfollowing] = useState([]);
    const [likes, setLikes] = useState({}); // ذخیره لایک‌ها
    const [stateLikes, setstateLikes] = useState([]); // مقداردهی اولیه به صورت آرایه خالی
    const [x, setX] = useState(0);  // مقدار اولیه x برابر با 0 است
    const [postisinpage, setpostisinpage] = useState()
    const [countLikesandcomments, setCountLikesandcomments] = useState([])
    const prevPostIdsRef = useRef();
    const postIds = posts.map(post => post.post_id);
    const [isCommentOpen, setIsCommentOpen] = useState(false);  // برای کنترل وضعیت باز یا بسته بودن
    const [commentsposts, setcommentsposts] = useState([])
    const prevPostIdsRef1 = useRef(JSON.stringify(postIds));
    const [newComment, setNewComment] = useState({});
    const [imageusers, setimageusers] = useState([])
    const [comments, setComments] = useState({});
    const [ISlikepost, setISlikepost] = useState([])
    const [IDesandusername, setIDesandusername] = useState([])
    const navigate = useNavigate()
    const [usernamepost, setusernamepost] = useState('')
    const [iamgeuserpost, setiamgeuserpost] = useState('')
    const [userimagepost, setuserimagepost] = useState('')
    // console.log('Idsfollowing =>' ,Idsfollowing)
    function getUserImageById2(userId) {
        const user = imageusers.find(user => user.id === userId);
        return user && user.image ? user.image : '/uploads/user.png'; // تصویر پیش‌فرض جدید
    }
    useEffect(() => {
        fetch(`https://p56x7f-5200.csb.app/api/users/limeitedinfousers`)
            .then(res => res.json())
            .then(result => {
                setimageusers(result)
                // console.log('image users ->', result)
            })
    }, [])
    const handleCommentChange = (postId, comment) => {
        setNewComment(prev => ({ ...prev, [postId]: comment }));
    };

    useEffect(() => {
        // تابع مقایسه آرایه‌ها
        const arraysEqual = (arr1, arr2) => {
            return JSON.stringify(arr1) === JSON.stringify(arr2);
        };

        // چک می‌کنیم که آیا postIds تغییر کرده
        if (!arraysEqual(prevPostIdsRef.current, postIds)) {
            // درخواست به سرور برای دریافت تعداد لایک‌ها و کامنت‌ها
            fetch('https://p56x7f-5200.csb.app/api/posts/likes-comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_ids: postIds }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('data =>', data);

                    const likesAndComments = data.reduce((acc, item) => {
                        acc[item.post_id] = {
                            likes: item.like_count,
                            comments: item.comment_count,
                        };
                        return acc;
                    }, {});

                    console.log('likesAndComments =>', likesAndComments);
                    setCountLikesandcomments(likesAndComments);
                })
                .catch(error => {
                    console.error('Error fetching likes and comments:', error);
                });
        }

        // به‌روزرسانی مقدار قبلی postIds
        prevPostIdsRef.current = postIds;

    }, [postIds]);
    useEffect(() => {
        if (userInfo && userInfo.id && Idsfollowing.length > 0) {
            fetch(`https://p56x7f-5200.csb.app/api/posts/multiple`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_ids: Idsfollowing }),
            })
                .then(response => response.json())
                .then(data => {
                    setposts(data);
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

    }, [Idsfollowing, userInfo]);
    useEffect(() => {
        // به روز رسانی صدای ویدیوها بر اساس وضعیت isMuted
        videoRefs.current.forEach((video) => {
            if (video) {
                video.muted = isMuted; // تنظیم صدا بر اساس isMuted
            }
        });
    }, [isMuted, posts]); // این اثر هر بار که isMuted یا posts تغییر کند اجرا خواهد شد

    const goToNext = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % posts.length;
            console.log('nextIndex =>', nextIndex)
            setpostisinpage(nextIndex)
            return nextIndex;
        });
    };
    // console.log('posts =>', posts)

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => {
            const prevIndexAdjusted = (prevIndex === 0 ? posts.length - 1 : prevIndex - 1);
            setpostisinpage(prevIndexAdjusted)
            return prevIndexAdjusted;
        });
    };



    const closeSlider = () => {
        setCurrentIndex(null); // Close slider when clicked outside or when done
    };

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

        const currentVideo = videoRefs.current[currentIndex];
        if (currentVideo) {
            observer.observe(currentVideo);
        }

        return () => {
            if (videoRefs.current[currentIndex]) {
                observer.unobserve(videoRefs.current[currentIndex]);
            }
        };
    }, [currentIndex, posts]);

    const handleVideoClick = () => {
        setstatesound(!statesound); // تغییر وضعیت صدا برای آیکون
        const newMuteStatus = !isMuted;
        setIsMuted(newMuteStatus); // به روز رسانی وضعیت muted
    };
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
    const toggleCommentSection = () => {
        setIsCommentOpen(prevState => !prevState);  // معکوس کردن وضعیت باز و بسته بودن
    };

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
    function handelDisLike(postID) {
        setX(-1)
        setstateLikes(prevState => prevState.filter(id => id !== postID));

        fetch('https://p56x7f-5200.csb.app/api/posts/unlike', {
            method: 'DELETE', // تغییر متد به POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userInfo?.id, post_id: postID }) // ارسال اطلاعات به صورت JSON
        })
            .then(res => res.json())
            .then(result => {
                // console.log('result likes user =>', result);
                setISlikepost(result.map(item => item.post_id))
            })
            .catch(error => {
                console.error('Error:', error); // اضافه کردن مدیریت خطا
            });
    }
    console.log('ISlikepost =>', ISlikepost)

    useEffect(() => {
        fetch('https://p56x7f-5200.csb.app/api/users/getalluserid')
            .then(res => res.json()).then(result => {
                // console.log('result id and username =>', result)
                setIDesandusername(result.results)

            })
    }, [])

    // console.log('IDesandusername =>', IDesandusername)

    useEffect(() => {
        if (IDesandusername && posts.length > 0) { // بررسی آماده بودن داده‌ها
            const id = posts[currentIndex]?.user_id;
            // console.log('id =>', id);
            // console.log('IDesandusername =>', IDesandusername);

            const user = IDesandusername.find(user => user.id === id);
            // console.log('user username =>', user);
            console.log()

            setusernamepost(user?.username);
            setuserimagepost(user?.image)
        }
    }, [IDesandusername, posts, currentIndex]); // اضافه کردن وابستگی‌ها


    // console.log('posts =>' , posts)
    // console.log('IDesandusername =>' , IDesandusername)

    return (
        <div style={{ direction: 'rtl' }}>
            <div className="slider-container">
                <button className="prev" onClick={goToPrevious}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="slider">
                    <div className="post1">
                        {posts[currentIndex].media_url && ['.mp4', '.webm', '.avi'].some(ext => posts[currentIndex].media_url.endsWith(ext)) ? (
                            <video
                                width="100%"
                                ref={(el) => { videoRefs.current[currentIndex] = el; }} // Use currentIndex to reference the video element
                                muted={isMuted} // Use isMuted to control mute state
                                key={posts[currentIndex].post_id}
                                loop
                            >
                                <source
                                    src={posts[currentIndex].media_url} // Use media_url as the video source
                                    type={`video/${posts[currentIndex].media_url.split('.').pop()}`} // Extract video type based on the extension
                                />
                                مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                            </video>
                        ) : (
                            <img
                                src={posts[currentIndex].image} // Image source as usual
                                alt={`Post ${posts[currentIndex].post_id}`}
                                key={posts[currentIndex].post_id}
                            />
                        )}
                    </div>
                    <div className='rightupbottom'>
                        {
                            stateLikes.includes(posts[currentIndex].post_id) ? (
                                <>
                                    <li>
                                        <FontAwesomeIcon onClick={() => handelDisLike(posts[currentIndex].post_id)}
                                            icon={faHeart} style={{ color: '#e01010', fontSize: '25px' }} />
                                        <h4>{(countLikesandcomments[posts[currentIndex].post_id]?.likes || 0) + x}</h4>

                                    </li>
                                </>
                            ) : (
                                <>
                                    {
                                        ISlikepost.includes(posts[currentIndex].post_id) ? (
                                            <ul className='sliderul'>
                                                <li>
                                                    <FontAwesomeIcon onClick={() => handelDisLike(posts[currentIndex].post_id)}
                                                        icon={faHeart} style={{ color: '#e01010', fontSize: '25px' }} />
                                                    <h4>{(countLikesandcomments[posts[currentIndex].post_id]?.likes || 0) + x}</h4>

                                                </li>
                                            </ul>
                                        ) : (
                                            <>
                                                <li onClick={() => handleLike(posts[currentIndex].post_id)}>
                                                    <FaRegHeart
                                                        style={{
                                                            color: 'white',
                                                            fontSize: '25px',
                                                        }}
                                                    />
                                                    <h4>{(countLikesandcomments[posts[currentIndex].post_id]?.likes || 0) + x}</h4>

                                                </li>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                        <li onClick={toggleCommentSection}><FaRegComment className='color' style={{
                            color: 'white',
                            fontSize: '25px',
                        }} />
                            <h4>{countLikesandcomments[posts[currentIndex].post_id]?.comments || 0}</h4>
                        </li>
                        <li><FaShareSquare className='color' style={{
                            color: 'white',
                            fontSize: '25px',
                        }} /></li>
                    </div>
                    <div className="rightbottom" onClick={handleVideoClick}>
                        {statesound === false ? (
                            <FaVolumeMute style={{ color: 'gray', fontSize: '25px' }} />
                        ) : (
                            <FaVolumeUp style={{ color: 'gray', fontSize: '25px' }} />
                        )}
                    </div>
                </div>
                <div className='bootomleft'>
                    <h2>{usernamepost}</h2>
                </div>
                <div className='bottomleftleft'>
                    <img src={`http://localhost:5200${userimagepost}`} alt="" />
                </div>
                <button className="next" onClick={goToNext}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
            <div className={`comment-section ${isCommentOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={toggleCommentSection}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className="comments-section">
                    {
                        commentsposts
                            .filter(comment => comment.post_id === posts[currentIndex].post_id) // فیلتر کردن کامنت‌ها بر اساس post_id
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
                <div className='text-postslider'>
                    <input
                        className='inputpostslider'
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment[posts[currentIndex].post_id] || ''}
                        onChange={(e) => handleCommentChange(posts[currentIndex].post_id, e.target.value)}
                    />
                    <button onClick={() => handleCommentSubmit(posts[currentIndex].post_id)}>ارسال</button>
                </div>
            </div>


        </div>

    );
}
