"""
Master API Router Aggregator
"""

from fastapi import APIRouter
from backend.api.isl_routes import router as isl_router
from backend.api.nlp_routes import router as nlp_router
from backend.api.speech_routes import router as speech_router
from backend.api.learning_routes import router as learning_router

api_router = APIRouter(prefix="/api")

api_router.include_router(isl_router)
api_router.include_router(nlp_router)
api_router.include_router(speech_router)
api_router.include_router(learning_router)
