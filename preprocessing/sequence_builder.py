"""
Sequence Builder Module
Maintains fixed-length sliding window queues for real-time sequence prediction.
"""

from typing import List, Optional, Deque
from collections import deque
import numpy as np


class SequenceBuilder:
    """
    Buffers consecutive frame feature vectors to construct (sequence_length, num_features) inputs.
    """

    def __init__(self, sequence_length: int = 30, num_features: int = 126):
        self.sequence_length = sequence_length
        self.num_features = num_features
        self.buffer: Deque[np.ndarray] = deque(maxlen=sequence_length)

    def add_frame(self, frame_features: np.ndarray) -> bool:
        """
        Adds a single frame's feature vector.
        Returns True if the buffer is full and ready for prediction, False otherwise.
        """
        if frame_features.shape[0] != self.num_features:
            # Pad or truncate if dimensions differ
            if frame_features.shape[0] < self.num_features:
                padded = np.zeros(self.num_features)
                padded[:frame_features.shape[0]] = frame_features
                frame_features = padded
            else:
                frame_features = frame_features[:self.num_features]

        self.buffer.append(frame_features)
        return len(self.buffer) == self.sequence_length

    def get_sequence(self) -> np.ndarray:
        """
        Returns the current buffer as a numpy array of shape (sequence_length, num_features).
        If not full, left-pads with zeros.
        """
        if len(self.buffer) == 0:
            return np.zeros((self.sequence_length, self.num_features))

        current_frames = list(self.buffer)
        if len(current_frames) < self.sequence_length:
            padding_count = self.sequence_length - len(current_frames)
            padding = [np.zeros(self.num_features) for _ in range(padding_count)]
            return np.array(padding + current_frames, dtype=np.float32)

        return np.array(current_frames, dtype=np.float32)

    def is_ready(self) -> bool:
        return len(self.buffer) == self.sequence_length

    def clear(self):
        self.buffer.clear()
