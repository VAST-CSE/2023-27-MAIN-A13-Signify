"""
Application Configuration Module
Reads environment variables with fallback defaults.
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # App Information
    APP_NAME: str = "Smart ISL Communication Assistant"
    APP_VERSION: str = "1.0.0-skeleton"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "127.0.0.1"

    # CORS Settings
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    # ML Model Configuration
    MODEL_WEIGHTS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml_model", "weights")
    MODEL_WEIGHTS_FILE: str = ""
    MODEL_FRAME_SEQUENCE_LENGTH: int = 30
    MODEL_FEATURE_DIM: int = 126  # e.g., 21 left hand * 3 + 21 right hand * 3 (or extended pose)
    MODEL_CONFIDENCE_THRESHOLD: float = 0.70

    # MediaPipe Settings
    MEDIAPIPE_MIN_DETECTION_CONFIDENCE: float = 0.5
    MEDIAPIPE_MIN_TRACKING_CONFIDENCE: float = 0.5

    # NLP Settings
    NLP_MODEL_NAME: str = "t5-small"
    USE_TRANSFORMER_NLP: bool = False

    # Speech Settings
    WHISPER_MODEL_SIZE: str = "base"
    USE_LOCAL_WHISPER: bool = False

    # Database / Storage
    DATABASE_TYPE: str = "in-memory"
    FIREBASE_CONFIG_PATH: str = ""

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
