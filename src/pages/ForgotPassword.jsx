import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './auth.css';

function ForgotPassword() {
    const [formData, setFormData] = useState({
        country: 'United States',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { resetPassword } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.email) {
            setError('Please enter your email address');
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        // Use Supabase resetPassword
        const result = await resetPassword(formData.email);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Failed to send reset email. Please try again.');
        }
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
                        <h2 className="smartz-login-success-title">Email Sent!</h2>
                        <p className="smartz-login-success-text">
                            We've sent a password reset link to <strong>{formData.email}</strong>
                        </p>
                        <p className="smartz-login-success-subtext">
                            Please check your email and follow the instructions to reset your password.
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
                <p className="smartz-login-welcome">Reset Your Password</p>
            </div>

            {/* Forgot Password Form */}
            <div className="smartz-login-form-container">
                <form onSubmit={handleSubmit} className="smartz-login-form">
                    {error && (
                        <div className="smartz-login-error">
                            {error}
                        </div>
                    )}

                    <div className="smartz-login-instructions">
                        <p>Enter your email address and we'll send you a link to reset your password.</p>
                    </div>

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

                    {/* Send Reset Link Button */}
                    <button
                        type="submit"
                        className="smartz-login-button"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="smartz-login-footer">
                    <p className="smartz-login-footer-text">
                        Remember your password?{' '}
                        <Link to="/login" className="smartz-login-footer-link">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
