import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SignUp.module.css'; // 👈 import CSS module

const Login = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/client/find/${username.trim()}`);
                console.log(response.data);
                localStorage.setItem('clientId', response.data.client.clientid);
                navigate('/client');
            } catch (error) {
                console.error('Error logging in:', error);
                alert('Failed to login. Please try again.');
            }
        } else {
            alert('Please fill all fields.');
        }
    };

    // Add this handler for navigation
    const handleSignUpClick = () => {
        navigate('/SignUp');
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
                    placeholder="Enter your client ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles['login-input']}
                />
                <button type="submit" className={styles['login-button']}>
                   Login to my account
                </button>
            </form>
            {/* Sign Up button */}
            <form className={styles['login-form']}>
                <button
                    type="button"
                    className={styles['login-button']}
                    onClick={handleSignUpClick}
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Login;
