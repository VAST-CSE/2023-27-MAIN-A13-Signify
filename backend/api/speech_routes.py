"""
Speech API Endpoints (Speech-to-Text & Text-to-Speech)
"""

from fastapi import APIRouter, UploadFile, File
from backend.schemas.models import (
    SpeechTranscribeResponse,
    TTSRequest,
    TTSResponse
)
from speech.whisper_service import whisper_service
from speech.tts_service import tts_service

router = APIRouter(tags=["Speech Services"])


@router.post("/speech/transcribe", response_model=SpeechTranscribeResponse)
async def transcribe_speech(file: UploadFile = File(None)):
    """
    Transcribes audio input using Whisper STT abstraction.
    """
    if file is None:
        return SpeechTranscribeResponse(
            status="empty_payload",
            text="",
            message="No audio file uploaded. Client Web Speech API can be used directly.",
            duration_seconds=0.0
        )

    content = await file.read()
    result = whisper_service.transcribe_audio_bytes(content, filename=file.filename or "audio.wav")

    return SpeechTranscribeResponse(
        status=result.get("status", "whisper_not_loaded"),
        text=result.get("text", ""),
        message=result.get("message", "Whisper model not loaded."),
        duration_seconds=result.get("duration_seconds", 0.0)
    )


@router.post("/tts", response_model=TTSResponse)
def synthesize_tts(request: TTSRequest):
    """
    Synthesizes speech metadata for client speech synthesis.
    """
    result = tts_service.synthesize(request.text, voice=request.voice)
    return TTSResponse(
        status=result.get("status", "success"),
        text=result.get("text", request.text),
        recommended_voice=result.get("recommended_voice", "en-IN"),
        rate=result.get("rate", 1.0),
        engine=result.get("engine", "web_speech_api_preferred"),
        message=result.get("message", "Ready for client playback.")
    )
