import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import './auth.css';

function ResetPassword() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Check if user has a valid session for password reset
        const checkSession = async () => {
            const supabase = await getSupabase();
            if (supabase) {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    navigate('/login');
                }
            }
        };

        checkSession();
    }, [navigate]);

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
        if (!formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const supabase = await getSupabase();

            if (!supabase) {
                setError('Authentication not configured');
                return;
            }

            const { error } = await supabase.auth.updateUser({
                password: formData.password
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (error) {
            setError('Failed to update password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="smartz-login">
                {/* App Header */}
                <div className="smartz-login-header">
                    <h1 className="smartz-login-logo">smartz</h1>
                    <p className="smartz-login-welcome">Password Updated!</p>
                </div>

                {/* Success Message */}
                <div className="smartz-login-form-container">
                    <div className="smartz-login-success">
                        <div className="smartz-login-success-icon">✅</div>
                        <h2 className="smartz-login-success-title">Success!</h2>
                        <p className="smartz-login-success-text">
                            Your password has been successfully updated.
                        </p>
                        <p className="smartz-login-success-subtext">
                            Redirecting to dashboard...
                        </p>
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
                <p className="smartz-login-welcome">Set New Password</p>
            </div>

            {/* Reset Password Form */}
            <div className="smartz-login-form-container">
                <form onSubmit={handleSubmit} className="smartz-login-form">
                    {error && (
                        <div className="smartz-login-error">
                            {error}
                        </div>
                    )}

                    <div className="smartz-login-instructions">
                        <p>Please enter your new password below.</p>
                    </div>

                    {/* New Password Input */}
                    <div className="smartz-login-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="smartz-login-input"
                            placeholder="New Password"
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
                            placeholder="Confirm New Password"
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

                    {/* Update Password Button */}
                    <button
                        type="submit"
                        className="smartz-login-button"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
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

export default ResetPassword;
