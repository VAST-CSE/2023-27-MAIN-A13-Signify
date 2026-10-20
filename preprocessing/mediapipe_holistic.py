"""
MediaPipe Holistic Initializer and Frame Processing Wrapper

Encapsulates MediaPipe Holistic detection pipeline for hand and body pose tracking.
"""

from typing import Optional, Dict, Any, Tuple
import numpy as np


class HolisticProcessor:
    """
    Wrapper for MediaPipe Holistic tracking.
    Safely handles environments where MediaPipe is installed or running in API mock/client mode.
    """

    def __init__(self, min_detection_confidence: float = 0.5, min_tracking_confidence: float = 0.5):
        self.min_detection_confidence = min_detection_confidence
        self.min_tracking_confidence = min_tracking_confidence
        self.holistic = None
        self._is_initialized = False
        self._init_mediapipe()

    def _init_mediapipe(self):
        try:
            import mediapipe as mp
            self.mp_holistic = mp.solutions.holistic
            self.mp_drawing = mp.solutions.drawing_utils
            self.holistic = self.mp_holistic.Holistic(
                min_detection_confidence=self.min_detection_confidence,
                min_tracking_confidence=self.min_tracking_confidence
            )
            self._is_initialized = True
        except (ImportError, Exception):
            # MediaPipe not installed or failed to initialize native graph
            self._is_initialized = False
            self.holistic = None

    def is_available(self) -> bool:
        return self._is_initialized

    def process_frame(self, image_rgb: np.ndarray) -> Optional[Any]:
        """
        Processes an RGB image frame and returns MediaPipe holistic results.
        """
        if not self._is_initialized or self.holistic is None:
            return None
        return self.holistic.process(image_rgb)

    def close(self):
        if self.holistic:
            self.holistic.close()
