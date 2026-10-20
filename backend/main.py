"""
Smart Indian Sign Language (ISL) Communication Assistant
Backend Application Entry Point
"""

import sys
import os

# Add root directory to sys.path so backend can import ml_model, preprocessing, config, etc.
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from backend.schemas.models import SystemHealthResponse
from backend.api.routes import api_router
from ml_model.model_loader import get_isl_model
from preprocessing.mediapipe_holistic import HolisticProcessor
from nlp.gloss_translator import gloss_translator
from speech.whisper_service import whisper_service

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Final-Year College Project: Two-Way ISL <-> English Communication System using CNN-BiLSTM with Attention."
)

# Configure CORS for Frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list + ["*"],  # Permissive for local dev testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=SystemHealthResponse, tags=["Health"])
def health_check():
    """
    Returns full system diagnostics and module readiness.
    """
    model = get_isl_model()
    holistic = HolisticProcessor()

    return SystemHealthResponse(
        status="ok",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        model_architecture="CNN-BiLSTM with Attention",
        model_loaded=model.is_loaded(),
        weights_path=getattr(model, "weights_path", None),
        mediapipe_available=holistic.is_available(),
        nlp_ready=gloss_translator.is_loaded(),
        whisper_ready=whisper_service.is_available(),
        database_type=settings.DATABASE_TYPE
    )


# Register all modular sub-routes
app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
