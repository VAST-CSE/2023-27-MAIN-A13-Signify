import React, { useState, useRef } from 'react';
import { Mic, MicOff, Send, RotateCcw, Volume2, MessageSquareText, Sparkles, Wand2 } from 'lucide-react';
import Card from '../components/Card';
import { speechUtils } from '../utils/speech';
import { apiService } from '../services/api';

export default function EnglishToISL() {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [islOutputResult, setIslOutputResult] = useState(null);

  const recognizerRef = useRef(null);

  const toggleListening = () => {
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!speechUtils.isRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser. Please type your sentence instead.');
      return;
    }

    const recognizer = speechUtils.createRecognizer({
      onResult: (transcript) => {
        setSpeechTranscript(transcript);
        setInputText(transcript);
      },
      onError: (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
      continuous: true
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      recognizer.start();
      setIsListening(true);
    }
  };

  const handleProcess = async () => {
    const textToProcess = inputText.trim() || speechTranscript.trim();
    if (!textToProcess) {
      alert('Please type or say a sentence before converting it.');
      return;
    }

    setIsProcessing(true);
    const result = await apiService.englishToISL(textToProcess);
    setIslOutputResult(result);
    setIsProcessing(false);
  };

  const handleSpeak = () => {
    const textToSpeak = inputText.trim() || speechTranscript.trim();
    if (!textToSpeak) {
      alert('There is no sentence to speak yet.');
      return;
    }
    speechUtils.speakText(textToSpeak);
  };

  const handleReset = () => {
    recognizerRef.current?.stop();
    setIsListening(false);
    setInputText('');
    setSpeechTranscript('');
    setIslOutputResult(null);
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="hero-badges">
          <span className="status-pill ready">English to Sign</span>
          <span className="status-pill info">Text and voice</span>
        </div>
        <h1>English to Sign</h1>
        <p>Type a sentence or speak into the mic, then convert it into ISL output.</p>
      </div>

      <div className="simple-grid">
        <Card title="Type or speak" icon={<MessageSquareText size={18} />}>
          <label className="field-label" htmlFor="english-input-box">English sentence</label>
          <textarea
            id="english-input-box"
            className="input-textarea"
            placeholder="Type a sentence like: I am happy today."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          {speechTranscript && (
            <div className="live-transcript-box">
              <span>Voice text</span>
              <strong>{speechTranscript}</strong>
            </div>
          )}

          <div className="button-row wrap top-spacing">
            <button className={`btn ${isListening ? 'btn-danger' : 'btn-secondary'}`} onClick={toggleListening}>
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              <span>{isListening ? 'Stop' : 'Speak'}</span>
            </button>

            <button className="btn btn-primary" onClick={handleProcess} disabled={isProcessing || (!inputText.trim() && !speechTranscript.trim())}>
              <Send size={18} />
              <span>{isProcessing ? 'Converting...' : 'Convert'}</span>
            </button>

            <button className="btn btn-secondary" onClick={handleReset} aria-label="Clear text">
              <RotateCcw size={18} />
            </button>
          </div>
        </Card>

        <Card title="ISL visual output" icon={<Wand2 size={18} />}>
          <div className="result-box">
            {islOutputResult && islOutputResult.isl_glosses?.length > 0 ? (
              <div className="gloss-token-row">
                {islOutputResult.isl_glosses.map((token, idx) => (
                  <span key={idx} className="token-pill">{token}</span>
                ))}
              </div>
            ) : (
              <p className="placeholder-text">The ISL output will be shown here.</p>
            )}
          </div>

          <div className="demo-visual-box">
            <Sparkles size={28} />
            <h3>Simple sign preview</h3>
            <p>Use the converted sign prompts to practice with your camera.</p>
          </div>

          <div className="button-row top-spacing">
            <button className="btn btn-primary" onClick={handleSpeak} disabled={!inputText.trim() && !speechTranscript.trim()}>
              <Volume2 size={18} />
              <span>Speak</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
