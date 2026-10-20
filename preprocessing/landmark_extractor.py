"""
Landmark Extractor Module
Extracts 3D coordinates from Left Hand, Right Hand, and Pose landmarks into flattened vectors.
"""

from typing import Optional, Dict, Any, List
import numpy as np


class LandmarkExtractor:
    """
    Extracts structured numerical arrays from raw MediaPipe or client-provided landmarks.
    """

    NUM_HAND_LANDMARKS = 21
    NUM_POSE_LANDMARKS = 33

    @classmethod
    def extract_from_mediapipe(cls, results: Any) -> Dict[str, np.ndarray]:
        """
        Extracts coordinate arrays from MediaPipe Holistic output results.
        Returns:
            Dict containing 'left_hand', 'right_hand', 'pose', and combined 'features'.
        """
        # Left hand: 21 landmarks * 3 (x, y, z) = 63
        if results and hasattr(results, 'left_hand_landmarks') and results.left_hand_landmarks:
            lh = np.array([[lm.x, lm.y, lm.z] for lm in results.left_hand_landmarks.landmark]).flatten()
        else:
            lh = np.zeros(cls.NUM_HAND_LANDMARKS * 3)

        # Right hand: 21 landmarks * 3 (x, y, z) = 63
        if results and hasattr(results, 'right_hand_landmarks') and results.right_hand_landmarks:
            rh = np.array([[lm.x, lm.y, lm.z] for lm in results.right_hand_landmarks.landmark]).flatten()
        else:
            rh = np.zeros(cls.NUM_HAND_LANDMARKS * 3)

        # Pose: 33 landmarks * 4 (x, y, z, visibility) = 132
        if results and hasattr(results, 'pose_landmarks') and results.pose_landmarks:
            pose = np.array([[lm.x, lm.y, lm.z, lm.visibility] for lm in results.pose_landmarks.landmark]).flatten()
        else:
            pose = np.zeros(cls.NUM_POSE_LANDMARKS * 4)

        # Standard 126-dimensional hand feature vector (Left Hand 63 + Right Hand 63)
        features_126 = np.concatenate([lh, rh])

        return {
            "left_hand": lh,
            "right_hand": rh,
            "pose": pose,
            "features_126": features_126,
            "left_hand_detected": bool(results and getattr(results, 'left_hand_landmarks', None)),
            "right_hand_detected": bool(results and getattr(results, 'right_hand_landmarks', None)),
            "pose_detected": bool(results and getattr(results, 'pose_landmarks', None))
        }

    @classmethod
    def extract_from_dict(cls, data: Dict[str, Any]) -> np.ndarray:
        """
        Parses JSON landmark dictionary sent from web client / frontend.
        """
        lh_raw = data.get("left_hand", [])
        rh_raw = data.get("right_hand", [])

        lh = np.zeros(cls.NUM_HAND_LANDMARKS * 3)
        rh = np.zeros(cls.NUM_HAND_LANDMARKS * 3)

        if isinstance(lh_raw, list) and len(lh_raw) > 0:
            flat_lh = []
            for pt in lh_raw:
                if isinstance(pt, dict):
                    flat_lh.extend([pt.get("x", 0.0), pt.get("y", 0.0), pt.get("z", 0.0)])
                elif isinstance(pt, (list, tuple)) and len(pt) >= 3:
                    flat_lh.extend(pt[:3])
            if len(flat_lh) == cls.NUM_HAND_LANDMARKS * 3:
                lh = np.array(flat_lh, dtype=np.float32)

        if isinstance(rh_raw, list) and len(rh_raw) > 0:
            flat_rh = []
            for pt in rh_raw:
                if isinstance(pt, dict):
                    flat_rh.extend([pt.get("x", 0.0), pt.get("y", 0.0), pt.get("z", 0.0)])
                elif isinstance(pt, (list, tuple)) and len(pt) >= 3:
                    flat_rh.extend(pt[:3])
            if len(flat_rh) == cls.NUM_HAND_LANDMARKS * 3:
                rh = np.array(flat_rh, dtype=np.float32)

        return np.concatenate([lh, rh])
