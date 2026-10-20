/**
 * API Service Client
 * Handles communication with the FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const apiService = {
  /**
   * Health & Module Status
   */
  async getHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('Backend connection failed:', error.message);
      return {
        status: 'error',
        app_name: 'Smart ISL Communication Assistant',
        version: '1.0.0-skeleton',
        model_architecture: 'CNN-BiLSTM with Attention',
        model_loaded: false,
        mediapipe_available: false,
        nlp_ready: false,
        whisper_ready: false,
        database_type: 'offline'
      };
    }
  },

  /**
   * CNN-BiLSTM with Attention Model Info
   */
  async getModelInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/isl/model-info`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      return {
        architecture: 'CNN-BiLSTM with Attention',
        status: 'Offline / Model not reachable',
        is_loaded: false
      };
    }
  },

  /**
   * Submit ISL landmark sequence for recognition
   */
  async recognizeISLSequence(frames, sessionId = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/isl/recognize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frames, session_id: sessionId })
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      return {
        status: 'model_not_loaded',
        message: 'Trained CNN-BiLSTM + Attention model not connected yet.',
        gloss: null,
        confidence: 0.0,
        top_k: []
      };
    }
  },

  /**
   * Translate ISL Gloss tokens to grammatically correct English
   */
  async glossToEnglish(glosses) {
    try {
      const response = await fetch(`${API_BASE_URL}/nlp/gloss-to-english`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ glosses })
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      return {
        status: 'nlp_model_not_connected',
        glosses,
        sentence: glosses.join(' '),
        message: 'Transformer NLP service not connected.'
      };
    }
  },

  /**
   * Convert English sentence to structured ISL representation
   */
  async englishToISL(text) {
    try {
      const response = await fetch(`${API_BASE_URL}/english/to-isl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      return {
        status: 'isl_generation_pending',
        english_text: text,
        isl_glosses: text.split(' ').map(w => w.toUpperCase()),
        message: 'ISL generation module will be connected in a later stage.'
      };
    }
  },

  /**
   * Get ISL Learning Curriculum
   */
  async getLearningLessons() {
    try {
      const response = await fetch(`${API_BASE_URL}/learning`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      return {
        categories: ['Alphabets', 'Everyday Greetings'],
        lessons: [],
        total_lessons: 0,
        system_status: 'Practice mode active.'
      };
    }
  }
};
