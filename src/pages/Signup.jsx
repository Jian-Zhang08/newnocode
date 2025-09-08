import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './auth.css';

function Signup() {
    const [formData, setFormData] = useState({
        country: 'United States',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { signup } = useAuth();
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
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const result = await signup(formData.name, formData.email, formData.password);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Signup failed');
        }

        setLoading(false);
    };

    if (success) {
        return (
            <div className="smartz-login">
                {/* App Header */}
                <div className="smartz-login-header">
                    <h1 className="smartz-login-logo">smartz</h1>
                    <p className="smartz-login-welcome">Check Your Email</p>
                </div>

                {/* Success Message */}
                <div className="smartz-login-form-container">
                    <div className="smartz-login-success">
                        <div className="smartz-login-success-icon">📧</div>
                        <h2 className="smartz-login-success-title">Account Created!</h2>
                        <p className="smartz-login-success-text">
                            We've sent a confirmation email to <strong>{formData.email}</strong>
                        </p>
                        <p className="smartz-login-success-subtext">
                            Please check your email and click the confirmation link to activate your account before signing in.
                        </p>
                        <Link to="/login" className="smartz-login-button">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="smartz-login">
            {/* App Header */}
            <div className="smartz-login-header">
                <h1 className="smartz-login-logo">smartz</h1>
                <p className="smartz-login-welcome">Create Your Account</p>
            </div>

            {/* Signup Form */}
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

                    {/* Full Name Input */}
                    <div className="smartz-login-field">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="smartz-login-input"
                            placeholder="Full Name"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="smartz-login-field">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="smartz-login-input"
                            placeholder="Email Address"
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

                    {/* Confirm Password Input */}
                    <div className="smartz-login-field">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="smartz-login-input"
                            placeholder="Confirm Password"
                            required
                        />
                        <button
                            type="button"
                            className="smartz-login-password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            🔒
                        </button>
                    </div>

                    {/* Create Account Button */}
                    <button
                        type="submit"
                        className="smartz-login-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                {/* Login Link */}
                <div className="smartz-login-footer">
                    <p className="smartz-login-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="smartz-login-footer-link">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
