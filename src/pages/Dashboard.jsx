import { useAuth } from '../contexts/AuthContext';
import { useConfig } from '../contexts/ConfigContext';
import { Link } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
    const { user, logout } = useAuth();
    const { config, isModuleEnabled } = useConfig();

    return (
        <div className="smartz-dashboard">


            {/* App Header */}
            <div className="smartz-header">
                <h1 className="smartz-app-title">
                    {config?.company?.name || 'smartz'}
                </h1>
            </div>

            {/* Main Content */}
            <div className="smartz-content">
                {/* Camera/Devices Card - Only show if camera module is enabled */}
                {isModuleEnabled('camera') && (
                    <div className="smartz-devices-card">
                        <div className="smartz-empty-icon">📁</div>
                        <p className="smartz-empty-text">
                            There are no devices yet. Please click the button below to add your smart devices.
                        </p>
                        <button className="smartz-add-device-btn">+ Add Device</button>
                    </div>
                )}

                {/* Navigation Section - Show enabled modules */}
                <div className="smartz-nav-section">
                    <div className="smartz-nav-item">
                        <div className="smartz-nav-icon">💬</div>
                        <span className="smartz-nav-text">Get Help</span>
                    </div>

                    {isModuleEnabled('cloud') && (
                        <>
                            <div className="smartz-nav-divider"></div>
                            <div className="smartz-nav-item">
                                <div className="smartz-nav-icon">☁️</div>
                                <span className="smartz-nav-text">Cloud</span>
                            </div>
                        </>
                    )}

                    {isModuleEnabled('vault') && (
                        <>
                            <div className="smartz-nav-divider"></div>
                            <div className="smartz-nav-item">
                                <div className="smartz-nav-icon">🔒</div>
                                <span className="smartz-nav-text">Vault</span>
                            </div>
                        </>
                    )}

                    <div className="smartz-nav-divider"></div>
                    <div className="smartz-nav-item">
                        <div className="smartz-nav-icon">🔔</div>
                        <span className="smartz-nav-text">Alerts</span>
                    </div>
                </div>

                {/* Feature Grid - Show only enabled modules */}
                <div className="smartz-feature-grid">
                    <div className="smartz-feature-card">
                        <div className="smartz-feature-illustration">
                            🌐
                        </div>
                        <span className="smartz-feature-label">Explore</span>
                    </div>

                    {isModuleEnabled('camera') && (
                        <div className="smartz-feature-card">
                            <div className="smartz-feature-illustration">
                                📷
                            </div>
                            <span className="smartz-feature-label">Devices</span>
                        </div>
                    )}

                    {isModuleEnabled('properties') && (
                        <div className="smartz-feature-card">
                            <div className="smartz-feature-illustration">
                                🏢
                            </div>
                            <span className="smartz-feature-label">My Properties</span>
                        </div>
                    )}

                    {isModuleEnabled('user-management') && (
                        <Link to="/users" className="smartz-feature-card smartz-feature-link">
                            <div className="smartz-feature-illustration">
                                👤
                            </div>
                            <span className="smartz-feature-label">My Account</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="smartz-footer">
                <p className="smartz-powered-by">
                    Powered by {config?.company?.poweredBy || 'Aedify'}
                </p>
                <div className="smartz-home-indicator"></div>
            </div>
        </div>
    );
}

export default Dashboard;
