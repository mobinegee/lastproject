
import { useTheme } from '../../Context/Context';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import React, { useState } from 'react'
import styles from './loginpage.module.css';
export default function Loginpage() {
    const { ShowSignForm, setShowSignForm } = useTheme();
    const { authorization, setAuthorization } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    function handelclick() {
        setShowSignForm(true)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic for submitting login form
        console.log('Email:', email);
        console.log('Password:', password);

        fetch('https://p56x7f-5200.csb.app/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Login failed');
                }
                return res.json();
            })
            .then(result => {
                if (result && result.token) {
                    localStorage.setItem('authorization', result.token);
                    const auth = result.token;
                    setAuthorization(auth)
                    console.log('successfully =>', result);
                    Swal.fire({
                        icon: "success",
                        title: "با موفقیت انجام شد",
                    });
                    navigate('/');
                } else {
                    throw new Error('Token not found in response');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: "error",
                    title: "خطا",
                    text: "رمز یا ایمیل اشتباه است",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            });
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <h2>ورود</h2>
                <form id="loginForm" onSubmit={handleSubmit}>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        type="email" placeholder="ایمیل" />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type="password" placeholder="گذرواژه" />
                    <button className={styles.buttonlogin} type="submit">ورود</button>
                    <li onClick={handelclick}>ثبت نام کرده اید ؟</li>
                </form>

            </div>
        </div>
    )
}
