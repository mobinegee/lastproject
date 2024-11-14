import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostExplore.css';
import { useTheme } from '../../Context/Context';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Tabs from '../../Components/Tebs/Tabs';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function PostExplore() {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [name, setname] = useState('');
    const [isLoading, setIsLoading] = useState(true); // وضعیت بارگذاری
    const navigate = useNavigate();
    const { userInfo, setuserInfo } = useTheme();

    // منتظر می‌ماند تا userInfo بارگذاری شود
    useEffect(() => {
        if (userInfo && userInfo.id) {
            setIsLoading(false); // وقتی که userInfo و id موجود است، حالت loading تمام می‌شود
        }
    }, [userInfo]);

    const userid = userInfo?.id; // گرفتن id از userInfo اگر موجود باشد

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handlenameChange = (e) => {
        setname(e.target.value);
    };

    const handleCaptionChange = (e) => {
        setCaption(e.target.value);
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        if (!userid) {
            alert('لطفاً ابتدا وارد حساب کاربری خود شوید.');
            return;
        }

        const formData = new FormData();
        formData.append('user_id', userid);
        formData.append('name', name);
        formData.append('caption', caption);
        formData.append('image', file);  // تغییر 'media' به 'image'

        try {
            const response = await fetch('https://p56x7f-5200.csb.app/api/posts/post', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (result.message === 'پست جدید با موفقیت ایجاد شد') {
                alert('پست با موفقیت ارسال شد!');
                navigate('/');
            }
        } catch (error) {
            console.error('خطا در ارسال پست:', error);
        }
    };

    const handleNavigation = (route) => {
        navigate(route);
    };

    return (
        <div style={{direction :'rtl'}}>
            {
                isLoading ? (
                    <div className="loading">در حال بارگذاری...</div> // می‌توانید اینجا یک انیمیشن یا متن "در حال بارگذاری" نمایش دهید
                ) : (
                    <div className="container">
                        <h2>ایجاد پست جدید</h2>
                        <form className="post-form" onSubmit={handlePostSubmit}>
                            <div className="form-group">
                                <label htmlFor="image">انتخاب تصویر یا ویدیو:</label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">نام :</label>
                                <input
                                    id="name"
                                    value={name}
                                    onChange={handlenameChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="caption">توضیحات:</label>
                                <textarea
                                    id="caption"
                                    rows="4"
                                    value={caption}
                                    onChange={handleCaptionChange}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit">ایجاد پست</button>
                        </form>
                    </div>
                )
            }

            <div className="tabs">
                <Tabs />
            </div>

        </div>
    );
}
