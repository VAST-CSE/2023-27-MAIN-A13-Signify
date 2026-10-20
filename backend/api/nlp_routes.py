"""
NLP API Endpoints (Gloss to English & English to ISL Structural Representation)
"""

from fastapi import APIRouter
from backend.schemas.models import (
    GlossToEnglishRequest,
    GlossToEnglishResponse,
    EnglishToISLRequest,
    EnglishToISLResponse
)
from nlp.gloss_translator import gloss_translator

router = APIRouter(tags=["NLP Translation"])


@router.post("/nlp/gloss-to-english", response_model=GlossToEnglishResponse)
def translate_gloss_to_english(request: GlossToEnglishRequest):
    """
    Translates recognized ISL gloss tokens into grammatically correct English.
    """
    result = gloss_translator.gloss_to_english(request.glosses)
    return GlossToEnglishResponse(
        status=result.get("status", "nlp_model_not_connected"),
        glosses=result.get("glosses", request.glosses),
        sentence=result.get("sentence", " ".join(request.glosses)),
        is_raw_gloss=result.get("is_raw_gloss", True),
        message=result.get("message", "Transformer NLP model not connected yet.")
    )


@router.post("/english/to-isl", response_model=EnglishToISLResponse)
def convert_english_to_isl(request: EnglishToISLRequest):
    """
    Processes English text/speech input into structured ISL glosses for visual synthesis.
    """
    result = gloss_translator.english_to_isl_structure(request.text)
    return EnglishToISLResponse(
        status=result.get("status", "isl_generation_pending"),
        english_text=result.get("english_text", request.text),
        isl_glosses=result.get("isl_glosses", []),
        message=result.get("message", "ISL generation module will be connected in a later stage."),
        visual_sequence_ready=result.get("visual_sequence_ready", False)
    )
