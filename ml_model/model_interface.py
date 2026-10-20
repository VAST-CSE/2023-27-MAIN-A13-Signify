"""
Model Interface Module
Defines the standard abstract base interface for ISL Gesture Recognition Models.
Ensures loose coupling between model implementation and web backend.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import numpy as np


class ISLModelInterface(ABC):
    """
    Abstract Base Class for ISL Recognition Models.
    Any deep learning model (e.g. CNN-BiLSTM with Attention) must implement this interface.
    """

    @abstractmethod
    def load_model(self, weights_path: Optional[str] = None) -> bool:
        """
        Loads the trained model architecture and weights from the specified path.
        Returns True if loaded successfully, False otherwise.
        """
        pass

    @abstractmethod
    def is_loaded(self) -> bool:
        """
        Checks if model weights are currently loaded and ready for inference.
        """
        pass

    @abstractmethod
    def predict(self, sequence: np.ndarray) -> Dict[str, Any]:
        """
        Performs inference on a single sequence of landmark frames.
        
        Args:
            sequence: Numpy array of shape (sequence_length, num_features)
            
        Returns:
            Dict containing:
                - gloss: Predicted ISL gloss string (e.g. 'HELLO')
                - confidence: Float confidence score (0.0 to 1.0)
                - top_k: List of top-k predictions with probabilities
        """
        pass

    @abstractmethod
    def predict_batch(self, sequences: np.ndarray) -> List[Dict[str, Any]]:
        """
        Performs inference on a batch of landmark sequences.
        """
        pass

    @abstractmethod
    def get_model_info(self) -> Dict[str, Any]:
        """
        Returns metadata about the model architecture, input shapes, and class labels.
        """
        pass
