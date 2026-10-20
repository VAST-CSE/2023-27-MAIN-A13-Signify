"""
Text-to-Speech (TTS) Service

Provides backend audio synthesis metadata and integration hooks.
Note: Browser Web Speech API is also supported directly on the client side.
"""

from typing import Dict, Any, Optional


class TTSService:
    """
    TTS Service interface for converting English sentences into spoken audio.
    """

    def __init__(self):
        self.default_voice = "en-IN"  # Indian English accent
        self.default_rate = 1.0

    def synthesize(self, text: str, voice: Optional[str] = None) -> Dict[str, Any]:
        """
        Generates TTS synthesis payload or directs frontend to utilize Web Speech API.
        """
        if not text or not text.strip():
            return {
                "status": "empty_text",
                "message": "No text provided for speech synthesis."
            }

        return {
            "status": "success",
            "text": text.strip(),
            "recommended_voice": voice or self.default_voice,
            "rate": self.default_rate,
            "engine": "web_speech_api_preferred",
            "message": "TTS request accepted for browser client synthesis."
        }


tts_service = TTSService()
