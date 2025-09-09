import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useConfig } from '../contexts/ConfigContext';
import { Link } from 'react-router-dom';
import AddDeviceModal from '../components/AddDeviceModal';
import CameraPlayer from '../components/CameraPlayer';
import LiveStreamPlayer from '../components/LiveStreamPlayer';
import './dashboard.css';

function Dashboard() {
    const { user, logout } = useAuth();
    const { config, isModuleEnabled } = useConfig();

    // Camera state
    const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
    const [devices, setDevices] = useState([]);

    // Load current stream from config on component mount
    useEffect(() => {
        if (config?.video?.currentStream && config?.video?.defaultStreams) {
            const currentStreamId = config.video.currentStream;
            const currentStream = config.video.defaultStreams.find(stream =>
                stream.id === currentStreamId && stream.enabled
            );

            if (currentStream) {
                const defaultDevice = {
                    id: currentStream.id,
                    type: 'livestream',
                    streamUrl: currentStream.url,
                    streamType: currentStream.type,
                    deviceId: currentStream.id,
                    name: currentStream.name,
                    addedAt: new Date().toISOString(),
                    isDefault: true
                };

                setDevices([defaultDevice]);
                console.log('Loaded current stream from config:', defaultDevice);
            }
        }
    }, [config]);

    // Handle adding a new device
    const handleAddDevice = async (deviceData) => {
        const newDevice = {
            id: Date.now().toString(),
            ...deviceData,
            addedAt: new Date().toISOString()
        };

        setDevices(prev => [...prev, newDevice]);
        console.log('Added device:', newDevice);
    };

    // Handle removing a device
    const handleRemoveDevice = (deviceId) => {
        setDevices(prev => prev.filter(device => device.id !== deviceId));
    };

    // Handle device error
    const handleDeviceError = (error) => {
        console.error('Device error:', error);
        // You could show a toast notification here
    };

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
                {/* Camera/Devices Section - Only show if camera module is enabled */}
                {isModuleEnabled('camera') && (
                    <div className="smartz-camera-section">
                        {devices.length === 0 ? (
                            <div className="smartz-devices-card">
                                <div className="smartz-empty-icon">📁</div>
                                <p className="smartz-empty-text">
                                    There are no devices yet. Please click the button below to add your smart devices.
                                </p>
                                <button
                                    className="smartz-add-device-btn"
                                    onClick={() => setShowAddDeviceModal(true)}
                                >
                                    + Add Device
                                </button>
                            </div>
                        ) : (
                            <div className="smartz-cameras-container">
                                {devices.map(device => {
                                    if (device.type === 'camera') {
                                        return (
                                            <CameraPlayer
                                                key={device.id}
                                                deviceId={device.deviceId}
                                                onError={handleDeviceError}
                                                onRemove={() => handleRemoveDevice(device.id)}
                                            />
                                        );
                                    } else if (device.type === 'livestream') {
                                        return (
                                            <LiveStreamPlayer
                                                key={device.id}
                                                streamUrl={device.streamUrl}
                                                streamType={device.streamType}
                                                deviceId={device.deviceId}
                                                title={device.name || (device.deviceId ? `Live Stream ${device.deviceId}` : 'Live Stream')}
                                                onError={handleDeviceError}
                                                onRemove={device.isDefault ? undefined : () => handleRemoveDevice(device.id)}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                                <button
                                    className="smartz-add-more-device-btn"
                                    onClick={() => setShowAddDeviceModal(true)}
                                >
                                    + Add More Devices
                                </button>
                            </div>
                        )}
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
                <p className="smartz-powered-by" style={{ display: 'var(--show-powered-by, block)' }}>
                    Powered by {config?.company?.poweredBy || 'Aedify'}
                </p>
                <div className="smartz-home-indicator"></div>
            </div>

            {/* Add Device Modal */}
            <AddDeviceModal
                isOpen={showAddDeviceModal}
                onClose={() => setShowAddDeviceModal(false)}
                onConfirm={handleAddDevice}
            />
        </div>
    );
}

export default Dashboard;
