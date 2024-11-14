import { useTheme } from '../../Context/Context';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';



import React, { useState } from 'react'
import styles from './signpage.module.css';
export default function Signpage() {
    const { isLogin, setisLogin } = useTheme();
    const { ShowSignForm, setShowSignForm } = useTheme();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null); // State to handle errors
    const navigate = useNavigate();
    const { authorization, setAuthorization } = useTheme();

    function handelclick() {
        setShowSignForm(false)

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null); // Reset error state

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'خطا',
                text: 'رمزها مطابقت ندارند',
            });
            return;
        }

        fetch('https://p56x7f-5200.csb.app/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(result => {
                if (result.success) {
                    localStorage.setItem('authorization', result.token);
                    const auth = result.token;
                    setAuthorization(auth)
                    Swal.fire({
                        icon: 'success',
                        title: 'موفقیت',
                        text: 'با موفقیت ثبت‌نام شدید',
                    });

                    navigate('/');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'خطا',
                        text: result.message || 'ثبت‌نام ناموفق بود',
                    });
                }
            })
            .catch(err => {
                console.error('Error during registration:', err.message);
                Swal.fire({
                    icon: 'error',
                    title: 'خطا',
                    text: 'خطایی در طی ثبت‌نام رخ داده است. لطفاً دوباره تلاش کنید.',
                });
            });

        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <h2>ثبت نام</h2>
                <form id="registerForm" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="نام کاربری"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                    <input
                        type="email"
                        placeholder="ایمیل"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                    <input
                        type="password"
                        placeholder="گذرواژه"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="تکرار گذرواژه"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button className={styles.buttonsignup} type="submit">ثبت نام</button>
                    <li onClick={handelclick}>وارد شوید</li>

                </form>

            </div>
        </div>
    )
}
