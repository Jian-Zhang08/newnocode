import { useEffect, useRef, useState } from 'react';
import flvjs from 'flv.js';
import './camerplayer.css';

function CameraPlayer({ deviceId, onError, onRemove }) {
    const videoRef = useRef(null);
    const flvPlayerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Generate stream URL with device ID
    const generateStreamUrl = (devId) => {
        const baseUrl = 'https://flv.meshare.com/live';
        const params = new URLSearchParams({
            devid: devId,
            token: '68c04355b7ae7beb660eee52anLD_fGcLaZZcbN8clSzA1Uhg-bbkmfSwNi_xNtxMwj13',
            media_type: '1',
            channel: '0',
            rn: Date.now().toString(),
            aes_key: '04A7C2BE544148C8938B68FCB1B40FE3',
            has_audio: '0'
        });
        return `${baseUrl}?${params.toString()}`;
    };

    useEffect(() => {
        if (!deviceId || !videoRef.current) return;

        const initPlayer = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if FLV is supported
                if (!flvjs.isSupported()) {
                    throw new Error('FLV playback is not supported in this browser');
                }

                // Destroy existing player
                if (flvPlayerRef.current) {
                    flvPlayerRef.current.destroy();
                    flvPlayerRef.current = null;
                }

                // Create new player
                const streamUrl = generateStreamUrl(deviceId);
                console.log('Loading camera stream:', streamUrl);

                flvPlayerRef.current = flvjs.createPlayer({
                    type: 'flv',
                    url: streamUrl,
                    isLive: true,
                    hasAudio: false,
                    cors: true,
                    withCredentials: false
                }, {
                    enableWorker: false,
                    enableStashBuffer: false,
                    stashInitialSize: 128,
                    autoCleanupSourceBuffer: true
                });

                // Event listeners
                flvPlayerRef.current.on(flvjs.Events.LOADING_COMPLETE, () => {
                    console.log('Stream loaded successfully');
                    setLoading(false);
                    setIsPlaying(true);
                });

                flvPlayerRef.current.on(flvjs.Events.ERROR, (errorType, errorDetail, errorInfo) => {
                    console.error('FLV Player Error:', errorType, errorDetail, errorInfo);
                    const errorMessage = `Failed to load camera stream: ${errorDetail || 'Unknown error'}`;
                    setError(errorMessage);
                    setLoading(false);
                    setIsPlaying(false);
                    if (onError) onError(errorMessage);
                });

                flvPlayerRef.current.on(flvjs.Events.MEDIA_INFO, (mediaInfo) => {
                    console.log('Media info:', mediaInfo);
                });

                // Attach to video element and load
                flvPlayerRef.current.attachMediaElement(videoRef.current);
                flvPlayerRef.current.load();

            } catch (err) {
                console.error('Error initializing camera player:', err);
                const errorMessage = err.message || 'Failed to initialize camera player';
                setError(errorMessage);
                setLoading(false);
                setIsPlaying(false);
                if (onError) onError(errorMessage);
            }
        };

        initPlayer();

        // Cleanup on unmount
        return () => {
            if (flvPlayerRef.current) {
                flvPlayerRef.current.destroy();
                flvPlayerRef.current = null;
            }
        };
    }, [deviceId, onError]);

    const handlePlay = () => {
        if (flvPlayerRef.current && !isPlaying) {
            flvPlayerRef.current.play();
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        if (flvPlayerRef.current && isPlaying) {
            flvPlayerRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        // Re-trigger useEffect by updating a dependency
        const currentDeviceId = deviceId;
        // Force re-initialization
        setTimeout(() => {
            if (videoRef.current) {
                const streamUrl = generateStreamUrl(currentDeviceId);
                if (flvPlayerRef.current) {
                    flvPlayerRef.current.destroy();
                }
                // The useEffect will handle re-initialization
            }
        }, 100);
    };

    return (
        <div className="smartz-camera-player">
            <div className="smartz-camera-header">
                <div className="smartz-camera-info">
                    <span className="smartz-camera-icon">📷</span>
                    <span className="smartz-camera-title">Camera {deviceId}</span>
                </div>
                <button
                    className="smartz-camera-remove"
                    onClick={onRemove}
                    title="Remove camera"
                >
                    ×
                </button>
            </div>

            <div className="smartz-camera-video-container">
                {loading && (
                    <div className="smartz-camera-loading">
                        <div className="smartz-camera-spinner"></div>
                        <p>Loading camera stream...</p>
                    </div>
                )}

                {error && (
                    <div className="smartz-camera-error">
                        <div className="smartz-camera-error-icon">⚠️</div>
                        <p className="smartz-camera-error-message">{error}</p>
                        <button
                            className="smartz-camera-retry"
                            onClick={handleRetry}
                        >
                            Retry
                        </button>
                    </div>
                )}

                <video
                    ref={videoRef}
                    className="smartz-camera-video"
                    controls
                    muted
                    playsInline
                    style={{ display: loading || error ? 'none' : 'block' }}
                />

                {!loading && !error && (
                    <div className="smartz-camera-controls">
                        <button
                            className="smartz-camera-control-btn"
                            onClick={isPlaying ? handlePause : handlePlay}
                        >
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CameraPlayer;
