import React, { useRef, useState } from 'react';
import { Volume2, Check, Copy, Camera } from 'lucide-react';
import WebcamCapture from '../components/WebcamCapture';
import Card from '../components/Card';
import { apiService } from '../services/api';
import { speechUtils } from '../utils/speech';

const MODEL_SEQUENCE_LENGTH = 30;

function toLandmarkPoints(flatLandmarks) {
  return Array.from({ length: 21 }, (_, index) => ({
    x: flatLandmarks[index * 3] ?? 0,
    y: flatLandmarks[index * 3 + 1] ?? 0,
    z: flatLandmarks[index * 3 + 2] ?? 0
  }));
}

function toApiFrame(frameVector, frameIndex) {
  return {
    frame_index: frameIndex,
    left_hand: toLandmarkPoints(frameVector.leftHand),
    right_hand: toLandmarkPoints(frameVector.rightHand)
  };
}

export default function ISLToEnglish() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [recognizedGloss, setRecognizedGloss] = useState('');
  const [englishSentence, setEnglishSentence] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [landmarkStatus, setLandmarkStatus] = useState('Inactive');
  const landmarkSequenceRef = useRef([]);
  const recognitionEnabledRef = useRef(false);
  const recognitionInFlightRef = useRef(false);

  const handleStartRecognition = async (cameraActive = isStreaming) => {
    if (!cameraActive) {
      return;
    }

    landmarkSequenceRef.current = [];
    recognitionEnabledRef.current = true;
    setRecognizedGloss('');
    setEnglishSentence('');
    setResultMessage('');
    setLandmarkStatus('Tracking');
  };

  const submitSequence = async (frames) => {
    try {
      const prediction = await apiService.recognizeISLSequence(frames);
      if (!recognitionEnabledRef.current) return;

      if (prediction.status !== 'success' || !prediction.gloss) {
        setResultMessage(prediction.message || 'The recognition model did not return a sign.');
        setLandmarkStatus('Model unavailable');
        if (prediction.status === 'model_not_loaded') {
          recognitionEnabledRef.current = false;
        }
        return;
      }

      setRecognizedGloss(prediction.gloss);
      const translation = await apiService.glossToEnglish([prediction.gloss]);
      if (!recognitionEnabledRef.current) return;

      const hasEnglishMeaning =
        translation.status === 'success' &&
        translation.is_raw_gloss === false &&
        typeof translation.sentence === 'string' &&
        translation.sentence.trim().length > 0;

      setEnglishSentence(hasEnglishMeaning ? translation.sentence.trim() : '');
      setResultMessage(
        hasEnglishMeaning
          ? ''
          : translation.message || 'English meaning is unavailable because the gloss translation model is not connected.'
      );
      setLandmarkStatus(hasEnglishMeaning ? 'Sign recognized' : 'Gloss recognized; translation unavailable');
    } catch (error) {
      if (recognitionEnabledRef.current) {
        setResultMessage(error.message || 'Sign recognition failed.');
        setLandmarkStatus('Recognition error');
      }
    } finally {
      recognitionInFlightRef.current = false;
    }
  };

  const handleFrameProcessed = (frameVector) => {
    if (
      !recognitionEnabledRef.current ||
      recognitionInFlightRef.current ||
      !frameVector ||
      !Array.isArray(frameVector.leftHand) ||
      !Array.isArray(frameVector.rightHand)
    ) {
      return;
    }

    landmarkSequenceRef.current.push({
      frame: toApiFrame(frameVector, landmarkSequenceRef.current.length),
      hasHand: frameVector.handPresence !== 'none'
    });
    if (landmarkSequenceRef.current.length > MODEL_SEQUENCE_LENGTH) {
      landmarkSequenceRef.current.shift();
    }

    const frameCount = landmarkSequenceRef.current.length;
    if (frameCount < MODEL_SEQUENCE_LENGTH) {
      setLandmarkStatus(
        frameVector.handPresence !== 'none'
          ? `Collecting sign (${frameCount}/${MODEL_SEQUENCE_LENGTH})`
          : `Waiting for hands (${frameCount}/${MODEL_SEQUENCE_LENGTH})`
      );
      return;
    }

    const sequence = landmarkSequenceRef.current;
    landmarkSequenceRef.current = [];
    if (!sequence.some((frame) => frame.hasHand)) {
      setLandmarkStatus('Waiting for hands');
      return;
    }

    recognitionInFlightRef.current = true;
    setLandmarkStatus('Recognizing sign');
    void submitSequence(sequence.map((frame) => frame.frame));
  };

  const handleStopRecognition = () => {
    recognitionEnabledRef.current = false;
    setLandmarkStatus('Inactive');
    landmarkSequenceRef.current = [];
  };

  const handleSpeak = () => {
    const textToSpeak = englishSentence || recognizedGloss;
    if (!textToSpeak) {
      alert('There is no sentence to speak yet.');
      return;
    }
    speechUtils.speakText(textToSpeak);
  };

  const handleCopy = async () => {
    const textToCopy = englishSentence || recognizedGloss;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setResultMessage('Clipboard access is unavailable in this browser.');
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>Sign to English</h1>
      </div>

      <div className="sign-page-grid">
        <Card title="Camera" icon={<Camera size={18} />}>
          <WebcamCapture
            isStreaming={isStreaming}
            landmarkStatus={landmarkStatus}
            onFrameProcessed={handleFrameProcessed}
            onStreamingChange={(streaming) => {
              setIsStreaming(streaming);
              if (!streaming) {
                handleStopRecognition();
              } else {
                handleStartRecognition(true);
              }
            }}
          />
        </Card>

        <Card title="English sentence" icon={<Volume2 size={18} />}>
          <div className="result-box large">
            {recognizedGloss ? (
              <div>
                <p className="sentence-output"><strong>ISL gloss:</strong> {recognizedGloss}</p>
                <p className="sentence-output">
                  <strong>English meaning:</strong> {englishSentence || 'Unavailable'}
                </p>
                {resultMessage && <p className="placeholder-text" role="status">{resultMessage}</p>}
              </div>
            ) : resultMessage ? (
              <p className="placeholder-text" role="status">{resultMessage}</p>
            ) : (
              <p className="placeholder-text">Your result will appear here.</p>
            )}
          </div>

          <div className="button-row top-spacing">
            <button className="btn btn-primary" onClick={handleSpeak} disabled={!englishSentence && !recognizedGloss}>
              <Volume2 size={18} />
              <span>Speak</span>
            </button>

            <button className="btn btn-secondary" onClick={handleCopy} disabled={!englishSentence && !recognizedGloss}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
