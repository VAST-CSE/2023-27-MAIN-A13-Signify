"""
ISL Recognition API Endpoints
"""

from fastapi import APIRouter, HTTPException, status
from backend.schemas.models import ISLRecognizeRequest, ISLRecognizeResponse
from ml_model.model_loader import get_isl_model
from preprocessing.landmark_extractor import LandmarkExtractor
from preprocessing.normalizer import LandmarkNormalizer
import numpy as np

router = APIRouter(prefix="/isl", tags=["ISL Recognition"])


@router.get("/model-info")
def get_model_information():
    """
    Returns information about the CNN-BiLSTM with Attention architecture.
    """
    model = get_isl_model()
    return model.get_model_info()


@router.post("/recognize", response_model=ISLRecognizeResponse)
def recognize_isl_sequence(request: ISLRecognizeRequest):
    """
    Processes a sequence of landmark frames through preprocessing and passes to the CNN-BiLSTM + Attention model.
    If the model weights are not loaded, returns an honest status without faking predictions.
    """
    model = get_isl_model()
    frame_count = len(request.frames)

    if frame_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No landmark frames received."
        )

    # Preprocessing: convert request frames into normalized feature array
    extracted_features = []
    for f in request.frames:
        feat_dict = {
            "left_hand": [pt.model_dump() if hasattr(pt, 'model_dump') else pt for pt in f.left_hand] if f.left_hand else [],
            "right_hand": [pt.model_dump() if hasattr(pt, 'model_dump') else pt for pt in f.right_hand] if f.right_hand else []
        }
        raw_vec = LandmarkExtractor.extract_from_dict(feat_dict)
        norm_vec = LandmarkNormalizer.normalize_feature_vector(raw_vec)
        extracted_features.append(norm_vec)

    sequence_np = np.array(extracted_features, dtype=np.float32)

    # Check model loading status
    if not model.is_loaded():
        return ISLRecognizeResponse(
            status="model_not_loaded",
            message="Recognition requires compatible trained weights and framework-specific model loading and inference code.",
            model_architecture="CNN-BiLSTM with Attention",
            gloss=None,
            confidence=0.0,
            top_k=[],
            english_sentence=None,
            frame_count=frame_count
        )

    # Run inference through CNN-BiLSTM + Attention model
    prediction_result = model.predict(sequence_np)

    return ISLRecognizeResponse(
        status=prediction_result.get("status", "success"),
        message="Inference completed." if prediction_result.get("status") == "success" else prediction_result.get("message", ""),
        model_architecture="CNN-BiLSTM with Attention",
        gloss=prediction_result.get("gloss"),
        confidence=prediction_result.get("confidence", 0.0),
        top_k=prediction_result.get("top_k", []),
        english_sentence=None,
        frame_count=frame_count
    )
