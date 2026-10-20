"""
Pydantic Schemas for API Requests and Responses
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


# -------------------------------------------------------------
# Health Check Schemas
# -------------------------------------------------------------
class SystemHealthResponse(BaseModel):
    status: str = "ok"
    app_name: str
    version: str
    model_architecture: str = "CNN-BiLSTM with Attention"
    model_loaded: bool
    weights_path: Optional[str] = None
    mediapipe_available: bool
    nlp_ready: bool
    whisper_ready: bool
    database_type: str


# -------------------------------------------------------------
# ISL Recognition Schemas
# -------------------------------------------------------------
class LandmarkFrame(BaseModel):
    frame_index: Optional[int] = None
    left_hand: Optional[List[Dict[str, float]]] = Field(default_factory=list, description="21 3D points (x, y, z)")
    right_hand: Optional[List[Dict[str, float]]] = Field(default_factory=list, description="21 3D points (x, y, z)")
    pose: Optional[List[Dict[str, float]]] = Field(default_factory=list, description="Pose landmarks")


class ISLRecognizeRequest(BaseModel):
    frames: List[LandmarkFrame] = Field(..., description="Sequence of landmark frames (typically 30 frames)")
    session_id: Optional[str] = None


class TopKPrediction(BaseModel):
    gloss: str
    confidence: float


class ISLRecognizeResponse(BaseModel):
    status: str
    message: str
    model_architecture: str = "CNN-BiLSTM with Attention"
    gloss: Optional[str] = None
    confidence: float = 0.0
    top_k: List[TopKPrediction] = Field(default_factory=list)
    english_sentence: Optional[str] = None
    frame_count: int = 0


# -------------------------------------------------------------
# NLP Translation Schemas
# -------------------------------------------------------------
class GlossToEnglishRequest(BaseModel):
    glosses: List[str] = Field(..., description="List of recognized ISL Gloss words")


class GlossToEnglishResponse(BaseModel):
    status: str
    glosses: List[str]
    sentence: str
    is_raw_gloss: bool = True
    message: str


class EnglishToISLRequest(BaseModel):
    text: str = Field(..., description="English text or transcribed speech to convert to ISL structure")


class EnglishToISLResponse(BaseModel):
    status: str
    english_text: str
    isl_glosses: List[str]
    message: str
    visual_sequence_ready: bool = False


# -------------------------------------------------------------
# Speech Schemas
# -------------------------------------------------------------
class SpeechTranscribeResponse(BaseModel):
    status: str
    text: str
    message: str
    duration_seconds: float = 0.0


class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "en-IN"


class TTSResponse(BaseModel):
    status: str
    text: str
    recommended_voice: str
    rate: float
    engine: str
    message: str


# -------------------------------------------------------------
# Learning Module Schemas
# -------------------------------------------------------------
class LessonItem(BaseModel):
    id: str
    category: str
    name: str
    gloss: str
    description: str
    key_points: List[str]
    difficulty: str
    hand_used: str


class LearningResponse(BaseModel):
    categories: List[str]
    lessons: List[LessonItem]
    total_lessons: int
    system_status: str = "Practice interface active. CNN-BiLSTM evaluation model integration in progress."
