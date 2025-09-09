import { useEffect, useRef, useState } from 'react';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import './livestreamplayer.css';

function LiveStreamPlayer({ streamUrl, streamType = 'auto', deviceId, onError, onRemove, title }) {
    const videoRef = useRef(null);
    const flvPlayerRef = useRef(null);
    const hlsPlayerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [detectedType, setDetectedType] = useState(null);

    // Auto-detect stream type based on URL
    const detectStreamType = (url) => {
        if (url.includes('.m3u8')) return 'hls';
        if (url.includes('.flv')) return 'flv';
        if (url.includes('rtmp://')) return 'rtmp';
        if (url.includes('rtsp://')) return 'rtsp';
        return 'hls'; // Default to HLS
    };

    // Initialize HLS stream
    const initHLS = async (url) => {
        try {
            if (Hls.isSupported()) {
                if (hlsPlayerRef.current) {
                    hlsPlayerRef.current.destroy();
                }

                hlsPlayerRef.current = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });

                hlsPlayerRef.current.loadSource(url);
                hlsPlayerRef.current.attachMedia(videoRef.current);

                hlsPlayerRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('HLS manifest parsed successfully');
                    setLoading(false);
                    setIsPlaying(true);
                });

                hlsPlayerRef.current.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS Error:', data);
                    if (data.fatal) {
                        setError(`HLS Error: ${data.details || 'Unknown error'}`);
                        setLoading(false);
                        setIsPlaying(false);
                        if (onError) onError(`HLS Error: ${data.details || 'Unknown error'}`);
                    }
                });
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                videoRef.current.src = url;
                videoRef.current.addEventListener('loadedmetadata', () => {
                    setLoading(false);
                    setIsPlaying(true);
                });
            } else {
                throw new Error('HLS is not supported in this browser');
            }
        } catch (err) {
            console.error('HLS initialization error:', err);
            setError(`HLS Error: ${err.message}`);
            setLoading(false);
            if (onError) onError(`HLS Error: ${err.message}`);
        }
    };

    // Initialize FLV stream
    const initFLV = async (url) => {
        try {
            if (!flvjs.isSupported()) {
                throw new Error('FLV playback is not supported in this browser');
            }

            if (flvPlayerRef.current) {
                flvPlayerRef.current.destroy();
                flvPlayerRef.current = null;
            }

            flvPlayerRef.current = flvjs.createPlayer({
                type: 'flv',
                url: url,
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

            flvPlayerRef.current.on(flvjs.Events.LOADING_COMPLETE, () => {
                console.log('FLV stream loaded successfully');
                setLoading(false);
                setIsPlaying(true);
            });

            flvPlayerRef.current.on(flvjs.Events.ERROR, (errorType, errorDetail, errorInfo) => {
                console.error('FLV Player Error:', errorType, errorDetail, errorInfo);
                const errorMessage = `FLV Error: ${errorDetail || 'Unknown error'}`;
                setError(errorMessage);
                setLoading(false);
                setIsPlaying(false);
                if (onError) onError(errorMessage);
            });

            flvPlayerRef.current.attachMediaElement(videoRef.current);
            flvPlayerRef.current.load();
        } catch (err) {
            console.error('FLV initialization error:', err);
            setError(`FLV Error: ${err.message}`);
            setLoading(false);
            if (onError) onError(`FLV Error: ${err.message}`);
        }
    };

    // Initialize stream based on type
    const initStream = async () => {
        if (!streamUrl || !videoRef.current) return;

        try {
            setLoading(true);
            setError(null);
            setIsPlaying(false);

            const actualType = streamType === 'auto' ? detectStreamType(streamUrl) : streamType;
            setDetectedType(actualType);

            console.log(`Initializing ${actualType} stream:`, streamUrl);

            switch (actualType) {
                case 'hls':
                    await initHLS(streamUrl);
                    break;
                case 'flv':
                    await initFLV(streamUrl);
                    break;
                default:
                    // Try HLS first, then FLV
                    try {
                        await initHLS(streamUrl);
                    } catch (hlsError) {
                        console.log('HLS failed, trying FLV:', hlsError);
                        await initFLV(streamUrl);
                    }
                    break;
            }
        } catch (err) {
            console.error('Stream initialization error:', err);
            setError(`Stream Error: ${err.message}`);
            setLoading(false);
            if (onError) onError(`Stream Error: ${err.message}`);
        }
    };

    useEffect(() => {
        initStream();

        // Cleanup on unmount
        return () => {
            if (flvPlayerRef.current) {
                flvPlayerRef.current.destroy();
                flvPlayerRef.current = null;
            }
            if (hlsPlayerRef.current) {
                hlsPlayerRef.current.destroy();
                hlsPlayerRef.current = null;
            }
        };
    }, [streamUrl, streamType]);

    const handlePlay = () => {
        if (videoRef.current && !isPlaying) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        if (videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        initStream();
    };

    const handleReconnect = () => {
        setError(null);
        setLoading(true);
        // Force re-initialization
        setTimeout(() => {
            initStream();
        }, 1000);
    };

    return (
        <div className="smartz-livestream-player">
            <div className="smartz-livestream-header">
                <div className="smartz-livestream-info">
                    <span className="smartz-livestream-icon">📹</span>
                    <div className="smartz-livestream-details">
                        <span className="smartz-livestream-title">
                            {title || `Live Stream ${deviceId || ''}`}
                        </span>
                        {detectedType && (
                            <span className="smartz-livestream-type">
                                {detectedType.toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>
                {onRemove && (
                    <button
                        className="smartz-livestream-remove"
                        onClick={onRemove}
                        title="Remove stream"
                    >
                        ×
                    </button>
                )}
            </div>

            <div className="smartz-livestream-video-container">
                {loading && (
                    <div className="smartz-livestream-loading">
                        <div className="smartz-livestream-spinner"></div>
                        <p>Loading live stream...</p>
                        <p className="smartz-livestream-loading-details">
                            {detectedType ? `Connecting to ${detectedType.toUpperCase()} stream...` : 'Detecting stream type...'}
                        </p>
                    </div>
                )}

                {error && (
                    <div className="smartz-livestream-error">
                        <div className="smartz-livestream-error-icon">⚠️</div>
                        <p className="smartz-livestream-error-message">{error}</p>
                        <div className="smartz-livestream-error-actions">
                            <button
                                className="smartz-livestream-retry"
                                onClick={handleRetry}
                            >
                                Retry
                            </button>
                            <button
                                className="smartz-livestream-reconnect"
                                onClick={handleReconnect}
                            >
                                Reconnect
                            </button>
                        </div>
                    </div>
                )}

                <video
                    ref={videoRef}
                    className="smartz-livestream-video"
                    controls
                    muted
                    playsInline
                    autoPlay
                    style={{ display: loading || error ? 'none' : 'block' }}
                />

                {!loading && !error && (
                    <div className="smartz-livestream-controls">
                        <button
                            className="smartz-livestream-control-btn"
                            onClick={isPlaying ? handlePause : handlePlay}
                        >
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <button
                            className="smartz-livestream-control-btn"
                            onClick={handleReconnect}
                            title="Reconnect stream"
                        >
                            🔄
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LiveStreamPlayer;
