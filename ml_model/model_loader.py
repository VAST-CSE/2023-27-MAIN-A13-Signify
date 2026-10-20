"""
Model Loader and Singleton Manager
Responsible for detecting, instantiating, and caching the ISL Model instance.
"""

import os
import glob
from typing import Optional
from .model_interface import ISLModelInterface
from .cnn_bilstm_attention import CNNBiLSTMAttentionModel
from config.settings import settings


class ModelLoader:
    _instance: Optional[ISLModelInterface] = None

    @classmethod
    def get_model(cls) -> ISLModelInterface:
        """
        Retrieves or initializes the CNN-BiLSTM + Attention model singleton.
        Scans ml_model/weights/ for supported weight files.
        """
        if cls._instance is None:
            # Initialize model architecture interface
            model = CNNBiLSTMAttentionModel(
                sequence_length=settings.MODEL_FRAME_SEQUENCE_LENGTH,
                num_features=settings.MODEL_FEATURE_DIM
            )

            # Check if weights file is configured or present in weights dir
            weights_dir = settings.MODEL_WEIGHTS_DIR
            if not os.path.exists(weights_dir):
                os.makedirs(weights_dir, exist_ok=True)

            found_weights = None
            if settings.MODEL_WEIGHTS_FILE and os.path.exists(settings.MODEL_WEIGHTS_FILE):
                found_weights = settings.MODEL_WEIGHTS_FILE
            else:
                # Look for common model formats
                patterns = ["*.keras", "*.h5", "*.pth", "*.pt", "*.onnx"]
                for pattern in patterns:
                    matches = glob.glob(os.path.join(weights_dir, pattern))
                    if matches:
                        found_weights = matches[0]
                        break

            if found_weights:
                model.load_model(found_weights)
            
            cls._instance = model

        return cls._instance


def get_isl_model() -> ISLModelInterface:
    return ModelLoader.get_model()
