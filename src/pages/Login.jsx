import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useConfig } from '../contexts/ConfigContext';
import './auth.css';

function Login() {
    const [formData, setFormData] = useState({
        country: 'United States',
        email: 'a295590858@gmail.com',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const { config } = useConfig();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Login failed');
        }

        setLoading(false);
    };

    return (
        <div className="smartz-login">

            {/* App Header */}
            <div className="smartz-login-header">
                <h1 className="smartz-login-logo">
                    {config?.company?.name || 'smartz'}
                </h1>
                <p className="smartz-login-welcome">
                    Welcome to {config?.company?.displayName || 'Smartz Eaze'}
                </p>
            </div>

            {/* Login Form */}
            <div className="smartz-login-form-container">
                <form onSubmit={handleSubmit} className="smartz-login-form">
                    {error && (
                        <div className="smartz-login-error">
                            {error}
                        </div>
                    )}

                    {/* Country Selection */}
                    <div className="smartz-login-field">
                        <div className="smartz-login-country-field">
                            <span className="smartz-login-country-text">United States</span>
                            <div className="smartz-login-country-right">
                                <span className="smartz-login-country-code">+1</span>
                                <span className="smartz-login-country-arrow">▼</span>
                            </div>
                        </div>
                    </div>

                    {/* Email/Phone Input */}
                    <div className="smartz-login-field">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="smartz-login-input"
                            placeholder="Email / Phone"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="smartz-login-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="smartz-login-input"
                            placeholder="Password"
                            required
                        />
                        <button
                            type="button"
                            className="smartz-login-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            🔒
                        </button>
                    </div>

                    {/* Forgot Password */}
                    <div className="smartz-login-forgot">
                        <Link to="/forgot-password" className="smartz-login-forgot-link">Forgot Password</Link>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="smartz-login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Create Account */}
                <div className="smartz-login-footer">
                    <p className="smartz-login-footer-text">
                        Don't have an account?{' '}
                        <Link to="/signup" className="smartz-login-footer-link">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
