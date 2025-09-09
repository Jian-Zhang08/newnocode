import { useState } from 'react';
import './adddevicemodal.css';

function AddDeviceModal({ isOpen, onClose, onConfirm }) {
    const [deviceType, setDeviceType] = useState('camera');
    const [deviceId, setDeviceId] = useState('');
    const [streamUrl, setStreamUrl] = useState('');
    const [streamType, setStreamType] = useState('auto');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (deviceType === 'camera' && !deviceId.trim()) {
            alert('Please enter a device ID');
            return;
        }

        if (deviceType === 'livestream' && !streamUrl.trim()) {
            alert('Please enter a stream URL');
            return;
        }

        setLoading(true);
        try {
            const deviceData = {
                type: deviceType,
                deviceId: deviceId.trim(),
                streamUrl: streamUrl.trim(),
                streamType: streamType
            };

            await onConfirm(deviceData);
            // Reset form
            setDeviceId('');
            setStreamUrl('');
            setStreamType('auto');
            onClose();
        } catch (error) {
            console.error('Error adding device:', error);
            alert('Failed to add device. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setDeviceId('');
            setStreamUrl('');
            setStreamType('auto');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="smartz-modal-overlay" onClick={handleClose}>
            <div className="smartz-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="smartz-modal-header">
                    <h2 className="smartz-modal-title">Add New Device</h2>
                    <button
                        className="smartz-modal-close"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="smartz-modal-form">
                    <div className="smartz-modal-field">
                        <label className="smartz-modal-label">Device Type</label>
                        <select
                            value={deviceType}
                            onChange={(e) => setDeviceType(e.target.value)}
                            className="smartz-modal-select"
                            disabled={loading}
                        >
                            <option value="camera">📷 Camera (FLV Stream)</option>
                            <option value="livestream">📹 Live Stream (HLS/FLV)</option>
                        </select>
                    </div>

                    {deviceType === 'camera' && (
                        <div className="smartz-modal-field">
                            <label className="smartz-modal-label">Device ID</label>
                            <input
                                type="text"
                                value={deviceId}
                                onChange={(e) => setDeviceId(e.target.value)}
                                className="smartz-modal-input"
                                placeholder="Enter device ID (e.g., DMK19I2IHA07616)"
                                disabled={loading}
                                required
                            />
                        </div>
                    )}

                    {deviceType === 'livestream' && (
                        <>
                            <div className="smartz-modal-field">
                                <label className="smartz-modal-label">Stream URL</label>
                                <input
                                    type="url"
                                    value={streamUrl}
                                    onChange={(e) => setStreamUrl(e.target.value)}
                                    className="smartz-modal-input"
                                    placeholder="Enter stream URL (e.g., https://example.com/stream.m3u8)"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="smartz-modal-field">
                                <label className="smartz-modal-label">Stream Type</label>
                                <select
                                    value={streamType}
                                    onChange={(e) => setStreamType(e.target.value)}
                                    className="smartz-modal-select"
                                    disabled={loading}
                                >
                                    <option value="auto">Auto-detect</option>
                                    <option value="hls">HLS (.m3u8)</option>
                                    <option value="flv">FLV (.flv)</option>
                                </select>
                            </div>

                            <div className="smartz-modal-field">
                                <label className="smartz-modal-label">Demo Streams</label>
                                <div className="smartz-modal-demo-streams">
                                    <button
                                        type="button"
                                        className="smartz-modal-demo-btn"
                                        onClick={() => setStreamUrl('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8')}
                                        disabled={loading}
                                    >
                                        Demo HLS Stream (Default)
                                    </button>
                                    <button
                                        type="button"
                                        className="smartz-modal-demo-btn"
                                        onClick={() => setStreamUrl('https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8')}
                                        disabled={loading}
                                    >
                                        Test Stream
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="smartz-modal-actions">
                        <button
                            type="button"
                            className="smartz-modal-cancel"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="smartz-modal-confirm"
                            disabled={loading || (deviceType === 'camera' ? !deviceId.trim() : !streamUrl.trim())}
                        >
                            {loading ? 'Adding...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddDeviceModal;
