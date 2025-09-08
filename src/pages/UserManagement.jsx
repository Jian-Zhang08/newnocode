import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './user-management.css';

function UserManagement() {
    const { user, logout } = useAuth();

    return (
        <div className="my-account">

            {/* Header */}
            <div className="my-account-header">
                <Link to="/dashboard" className="my-account-back-btn">←</Link>
                <h1 className="my-account-title">My Account</h1>
                <div className="my-account-spacer"></div>
            </div>

            {/* User Profile Section */}
            <div className="my-account-profile">
                <div className="my-account-avatar">
                    <div className="my-account-avatar-icon">👤</div>
                </div>
                <h2 className="my-account-username">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</h2>
                <p className="my-account-email">{user?.email || 'user@example.com'}</p>
            </div>

            {/* Quick Access Features */}
            <div className="my-account-quick-access">
                <div className="my-account-quick-item">
                    <div className="my-account-quick-icon">🔐</div>
                    <span className="my-account-quick-text">Vault</span>
                </div>
                <div className="my-account-quick-item">
                    <div className="my-account-quick-icon">📋</div>
                    <span className="my-account-quick-text">My Orders</span>
                </div>
                <div className="my-account-quick-item">
                    <div className="my-account-quick-icon">∞</div>
                    <span className="my-account-quick-text">3rd Party Services</span>
                </div>
            </div>

            {/* Account Management Options */}
            <div className="my-account-section">
                <div className="my-account-option">
                    <div className="my-account-option-icon">💳</div>
                    <span className="my-account-option-text">Payment Management</span>
                    <span className="my-account-option-arrow">→</span>
                </div>
                <div className="my-account-option">
                    <div className="my-account-option-icon">✉️</div>
                    <span className="my-account-option-text">Message</span>
                    <span className="my-account-option-arrow">→</span>
                </div>
                <div className="my-account-option">
                    <div className="my-account-option-icon">🔗</div>
                    <span className="my-account-option-text">Sharing</span>
                    <span className="my-account-option-arrow">→</span>
                </div>
            </div>

            {/* System Actions */}
            <div className="my-account-section">
                <div className="my-account-option">
                    <div className="my-account-option-icon">⚙️</div>
                    <span className="my-account-option-text">System Settings</span>
                    <span className="my-account-option-arrow">→</span>
                </div>
                <div className="my-account-option" onClick={logout}>
                    <div className="my-account-option-icon">🚪</div>
                    <span className="my-account-option-text">Log out</span>
                    <span className="my-account-option-arrow">→</span>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;
