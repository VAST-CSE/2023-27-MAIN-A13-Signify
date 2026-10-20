/**
 * Speech Recognition and Text-to-Speech Utilities
 * Implements browser native Web Speech API with fallback resilience.
 */

export const speechUtils = {
  /**
   * Checks if browser speech recognition is supported
   */
  isRecognitionSupported() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  },

  /**
   * Initializes Speech Recognition instance
   */
  createRecognizer({ onResult, onEnd, onError, continuous = false, lang = 'en-IN' }) {
    if (!this.isRecognitionSupported()) {
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      if (onResult) onResult(transcript, event.results[event.results.length - 1].isFinal);
    };

    recognition.onerror = (event) => {
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    return recognition;
  },

  /**
   * Speaks given text using SpeechSynthesis
   */
  speakText(text, { rate = 1.0, pitch = 1.0, lang = 'en-IN' } = {}) {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = lang;

    // Pick Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('India'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
};
