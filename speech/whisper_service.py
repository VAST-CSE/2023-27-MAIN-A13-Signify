"""
Whisper Speech-to-Text Service Abstraction

Provides modular speech recognition interface for audio transcription.
"""

from typing import Dict, Any, Optional
import os
from config.settings import settings


class WhisperService:
    """
    Speech transcription service.
    Can be configured to run local OpenAI Whisper or cloud endpoint when enabled.
    """

    def __init__(self, model_size: str = "base"):
        self.model_size = model_size
        self._is_loaded = False
        self.model = None

    def is_available(self) -> bool:
        return self._is_loaded

    def transcribe_audio_bytes(self, audio_bytes: bytes, filename: str = "audio.wav") -> Dict[str, Any]:
        """
        Transcribes binary audio payload.
        """
        if not audio_bytes:
            return {
                "status": "empty_audio",
                "text": "",
                "message": "No audio content received."
            }

        if not self._is_loaded or not settings.USE_LOCAL_WHISPER:
            return {
                "status": "whisper_not_loaded",
                "text": "",
                "message": "Whisper STT service is in modular placeholder mode. Browser Web Speech API is used on client.",
                "duration_seconds": 0.0
            }

        # Real Whisper execution hook:
        # import whisper
        # result = self.model.transcribe(temp_file_path)
        # return {"status": "success", "text": result["text"]}
        return {
            "status": "whisper_not_loaded",
            "text": "",
            "message": "Whisper STT service not initialized."
        }


whisper_service = WhisperService()
