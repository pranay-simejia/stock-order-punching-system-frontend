import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SignUp.module.css'; // 👈 import CSS module

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [pan, setPan] = useState('');
    const [gender, setGender] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && age.trim() && pan.trim() && gender.trim()) {
            try {
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/client/create`, {
                    name: username.trim(),
                    age: Number(age),
                    pancard: pan.trim(),
                    gender: gender.trim(),
                });

                localStorage.setItem('username', response.data.username || username);
                localStorage.setItem('clientId', response.data.clientId);
                navigate('/client');
            } catch (error) {
                console.error('Error creating user:', error);
                alert('Failed to create user. Please try again.');
            }
        } else {
            alert('Please fill all fields.');
        }
    };

    // Add this handler for navigation
    const handleLoginClick = () => {
        navigate('/');
    };

    return (
        <div className={styles['login-container']}>
            <h1 className={styles['login-title']}>
                Welcome to <br />
                <span>HFT Stock Punching System</span>
            </h1>

            <form onSubmit={handleSubmit} className={styles['login-form']}>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles['login-input']}
                />
                <input
                    type="number"
                    placeholder="Enter your Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={styles['login-input']}
                />
                <input
                    type="text"
                    placeholder="Enter your PAN Number"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    className={styles['login-input']}
                />
                <input
                    type="text"
                    placeholder="Enter your Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={styles['login-input']}
                />
                <button type="submit" className={styles['login-button']}>
                    Create Account
                </button>
            </form>
            {/* Login button */}
            <form className={styles['login-form']}>
                <button
                    type="button"
                    className={styles['login-button']}
                    onClick={handleLoginClick}
                >
                    Go to Login
                </button>
            </form>
        </div>
    );
};

export default SignUp;