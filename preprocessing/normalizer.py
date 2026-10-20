"""
Landmark Normalizer Module
Applies geometric transformations to ensure invariant spatial representation of gestures.
"""

from typing import Tuple
import numpy as np


class LandmarkNormalizer:
    """
    Normalizes 3D hand/pose landmarks:
    - Translation invariance: Centers coordinates relative to the wrist (landmark 0) or torso center.
    - Scale invariance: Scales coordinate vectors by the maximum hand/pose span.
    """

    @classmethod
    def normalize_hand(cls, hand_array: np.ndarray) -> np.ndarray:
        """
        Normalizes a 63-element hand array (21 landmarks x 3 coords).
        """
        if hand_array.shape[0] != 63 or np.all(hand_array == 0):
            return hand_array

        reshaped = hand_array.reshape(21, 3).copy()

        # Wrist is index 0
        wrist = reshaped[0, :]
        centered = reshaped - wrist

        # Compute max distance from wrist for scaling
        distances = np.linalg.norm(centered, axis=1)
        max_dist = np.max(distances)

        if max_dist > 1e-6:
            normalized = centered / max_dist
        else:
            normalized = centered

        return normalized.flatten()

    @classmethod
    def normalize_feature_vector(cls, features_126: np.ndarray) -> np.ndarray:
        """
        Normalizes both Left Hand (first 63) and Right Hand (last 63) in a 126-d feature vector.
        """
        if features_126.shape[0] != 126:
            return features_126

        lh_norm = cls.normalize_hand(features_126[:63])
        rh_norm = cls.normalize_hand(features_126[63:])

        return np.concatenate([lh_norm, rh_norm])
