import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Loader2
} from 'lucide-react';
import {
  buildHolisticFrameVector
} from '../utils/holisticPreprocessor';

export default function WebcamCapture({
  isStreaming,
  onStreamingChange,
  onFrameProcessed,
  landmarkStatus = 'Inactive',
  className = ''
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const holisticRef = useRef(null);
  const drawingUtilsRef = useRef(null);
  const connectionsRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [isInitializing, setIsInitializing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const stopHolisticProcessing = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const extractVisualLandmarks = (landmarks) => {
    if (!Array.isArray(landmarks)) {
      return [];
    }

    return landmarks.map((point) => ({
      x: Number.isFinite(point?.x) ? point.x : 0,
      y: Number.isFinite(point?.y) ? point.y : 0,
      z: Number.isFinite(point?.z) ? point.z : 0,
      visibility: Number.isFinite(point?.visibility) ? point.visibility : 0
    }));
  };

  const drawLandmarkResults = (result, video) => {
    const canvas = canvasRef.current;
    const drawingUtils = drawingUtilsRef.current;
    const connections = connectionsRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context || !drawingUtils || !connections) {
      return;
    }

    if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
    if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const drawSets = (landmarkSets, connectionSet, color, fillColor) => {
      if (!Array.isArray(landmarkSets)) return;

      landmarkSets.forEach((landmarks) => {
        if (!Array.isArray(landmarks) || landmarks.length === 0) return;
        drawingUtils.drawConnectors(landmarks, connectionSet, { color, lineWidth: 3 });
        drawingUtils.drawLandmarks(landmarks, { color, fillColor, radius: 4 });
      });
    };

    drawSets(result?.leftHandLandmarks, connections.hands, '#48D6C5', '#123D3A');
    drawSets(result?.rightHandLandmarks, connections.hands, '#FFC857', '#4A3712');
    drawSets(result?.poseLandmarks, connections.pose, '#80AFFF', '#1D3154');
  };

  const processFrame = () => {
    const video = videoRef.current;
    const holistic = holisticRef.current;

    if (!video || !holistic || !streamRef.current || video.readyState < 2) {
      if (streamRef.current) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
      }
      return;
    }

    try {
      const result = holistic.detectForVideo(video, performance.now());
      drawLandmarkResults(result, video);
      const frameVector = buildHolisticFrameVector({
        leftHand: extractVisualLandmarks(result?.leftHandLandmarks?.[0]),
        rightHand: extractVisualLandmarks(result?.rightHandLandmarks?.[0]),
        pose: extractVisualLandmarks(result?.poseLandmarks?.[0])
      });

      if (typeof onFrameProcessed === 'function') {
        onFrameProcessed(frameVector);
      }
    } catch (error) {
      console.warn('[Webcam] MediaPipe frame processing error:', error);
    }

    if (streamRef.current) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
    }
  };

  const initializeHolistic = async () => {
    if (holisticRef.current) {
      return;
    }

    try {
      const { FilesetResolver, HolisticLandmarker, DrawingUtils } = await import('@mediapipe/tasks-vision');

      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      holisticRef.current = await HolisticLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/holistic_landmarker/holistic_landmarker/float16/1/holistic_landmarker.task'
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minTrackingConfidence: 0.5,
        minDetectionConfidence: 0.5
      });

      const canvasContext = canvasRef.current?.getContext('2d');
      if (!canvasContext) {
        throw new Error('Unable to initialize the landmark overlay canvas.');
      }
      drawingUtilsRef.current = new DrawingUtils(canvasContext);
      connectionsRef.current = {
        hands: HolisticLandmarker.HAND_CONNECTIONS,
        pose: HolisticLandmarker.POSE_CONNECTIONS
      };

      console.log('[Webcam] MEDIAPIPE_INITIALIZED');
    } catch (error) {
      console.error('[Webcam] MEDIAPIPE_INIT_ERROR:', error);
      setErrorMsg('MediaPipe could not initialize. Please refresh and allow camera access.');
    }
  };

  const startCamera = async () => {
    console.log('[Webcam] START_REQUEST');

    setErrorMsg(null);
    setIsInitializing(true);

    if (!navigator.mediaDevices?.getUserMedia) {
      const message =
        'Webcam access is not supported by this browser. Please use a modern version of Edge, Chrome, or Firefox.';

      console.error('[Webcam] CAMERA_ERROR:', message);
      setErrorMsg(message);
      setIsInitializing(false);
      return;
    }

    if (streamRef.current) {
      console.log('[Webcam] Existing stream already active.');
      setIsInitializing(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;

      const video = videoRef.current;

      if (!video) {
        console.error('[Webcam] Video element is unavailable.');

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        setErrorMsg('Unable to initialize the video preview.');
        setIsInitializing(false);
        return;
      }

      video.srcObject = stream;

      await new Promise((resolve, reject) => {
        if (video.readyState >= 1) {
          resolve();
          return;
        }

        const handleLoadedMetadata = () => {
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
          resolve();
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });

        setTimeout(() => {
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
          reject(new Error('Video metadata loading timed out.'));
        }, 5000);
      });

      await video.play();
      await initializeHolistic();

      if (typeof onStreamingChange === 'function') {
        onStreamingChange(true);
      }

      if (typeof setIsStreaming === 'function') {
        setIsStreaming(true);
      }

      setIsInitializing(false);
      console.log('[Webcam] CAMERA_STARTED');
      animationFrameRef.current = requestAnimationFrame(processFrame);
    } catch (err) {
      console.error('[Webcam] CAMERA_ERROR:', err);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (stopError) {
            console.warn('[Webcam] Error stopping failed stream:', stopError);
          }
        });

        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      if (typeof onStreamingChange === 'function') {
        onStreamingChange(false);
      }

      if (typeof setIsStreaming === 'function') {
        setIsStreaming(false);
      }

      setIsInitializing(false);
      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError'
      ) {
        setErrorMsg(
          'Camera permission was denied. Please allow camera access in Edge and try again.'
        );
      } else if (
        err.name === 'NotFoundError' ||
        err.name === 'DevicesNotFoundError'
      ) {
        setErrorMsg(
          'No camera was found. Please check that your webcam is connected and available.'
        );
      } else if (
        err.name === 'NotReadableError' ||
        err.name === 'TrackStartError'
      ) {
        setErrorMsg(
          'The camera could not be started. It may already be in use by another application.'
        );
      } else if (err.name === 'OverconstrainedError') {
        setErrorMsg(
          'The requested camera settings are not supported by this device.'
        );
      } else {
        setErrorMsg(
          `Camera error: ${err.message || err.name || 'Unknown error'}`
        );
      }
    }
  };

  const stopCamera = () => {
    console.log('[Webcam] CAMERA_STOP_REQUEST');

    stopHolisticProcessing();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (error) {
          console.warn('[Webcam] Error stopping camera track:', error);
        }
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (typeof onStreamingChange === 'function') {
      onStreamingChange(false);
    }

    if (typeof setIsStreaming === 'function') {
      setIsStreaming(false);
    }

    setIsInitializing(false);
    console.log('[Webcam] CAMERA_STOPPED');
  };

  useEffect(() => {
    return () => {
      console.log('[Webcam] COMPONENT_UNMOUNT_CLEANUP');
      stopHolisticProcessing();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (error) {
            console.warn('[Webcam] Cleanup error:', error);
          }
        });

        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isStreaming) {
      stopHolisticProcessing();
    }
  }, [isStreaming]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
      className={className}
    >
      <div
        className="webcam-card"
        id="webcam-preview-container"
      >
        <video
          ref={videoRef}
          className="webcam-video"
          playsInline
          muted
          autoPlay
          style={{
            display: isStreaming ? 'block' : 'none'
          }}
        />
        <canvas
          ref={canvasRef}
          className="webcam-landmark-overlay"
          aria-hidden="true"
          style={{ display: isStreaming ? 'block' : 'none' }}
        />

        {isInitializing && (
          <div className="webcam-inactive-state">
            <div
              className="webcam-inactive-icon"
              style={{
                animation: 'spin 1.5s linear infinite'
              }}
            >
              <Loader2 size={32} />
            </div>

            <div>
              <p
                style={{
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.25rem'
                }}
              >
                Starting camera...
              </p>

              <p style={{ fontSize: '0.85rem' }}>
                Allow camera access to continue.
              </p>
            </div>
          </div>
        )}

        {!isStreaming && !isInitializing && (
          <div className="webcam-inactive-state">
            <div className="webcam-inactive-icon">
              <CameraOff size={32} />
            </div>

            <div>
              <p
                style={{
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.25rem'
                }}
              >
                Camera is off
              </p>

              <p style={{ fontSize: '0.85rem' }}>
                Start the camera when you are ready.
              </p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="camera-error">Camera unavailable</p>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '0.65rem',
              height: '0.65rem',
              borderRadius: '50%',
              background: isStreaming ? '#22c55e' : '#94a3b8',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{landmarkStatus}</span>
        </div>

        {!isStreaming ? (
          <button
            className="btn btn-primary"
            onClick={startCamera}
            disabled={isInitializing}
            id="btn-start-camera"
          >
            {isInitializing ? (
              <RefreshCw
                size={18}
                style={{
                  animation: 'spin 1s linear infinite'
                }}
              />
            ) : (
              <Camera size={18} />
            )}

            <span>
              {isInitializing
                ? 'Starting...'
                : 'Start Camera'}
            </span>
          </button>
        ) : (
          <button
            className="btn btn-danger"
            onClick={stopCamera}
            id="btn-stop-camera"
          >
            <CameraOff size={18} />

            <span>Stop Camera</span>
          </button>
        )}
      </div>
    </div>
  );
}