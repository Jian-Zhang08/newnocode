import { useAuth } from '../contexts/AuthContext';
import './layout.css';

function Layout({ children }) {
    const { user, logout } = useAuth();

    return (
        <div className="layout">
            {/* <header className="layout-header">
                <div className="layout-header-content">
                    <h1 className="layout-title">Smartz App</h1>
                    <div className="layout-user-info">
                        <span className="layout-user-name">Welcome, {user?.name}</span>
                        <button className="layout-logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header> */}

            {/* <nav className="layout-nav">
                <a href="/dashboard" className="layout-nav-item">
                    <span className="layout-nav-icon">🏠</span>
                    <span className="layout-nav-text">Dashboard</span>
                </a>
                <a href="/users" className="layout-nav-item">
                    <span className="layout-nav-icon">👥</span>
                    <span className="layout-nav-text">Users</span>
                </a>
            </nav> */}

            <main className="layout-main">
                {children}
            </main>
        </div>
    );
}

export default Layout;
