# Pipeline Design & Preprocessing Specifications

## 1. Input Specifications
- **Video Format**: Webcam stream (640x480 or 1280x720) at 30 frames per second.
- **Color Space**: RGB normalized frames.

## 2. Landmark Coordinate Extraction
- **Left Hand**: 21 landmarks (x, y, z) = 63 numerical features.
- **Right Hand**: 21 landmarks (x, y, z) = 63 numerical features.
- **Pose (Optional/Upper Body)**: 33 landmarks (x, y, z, visibility) = 132 features.
- **Default Feature Vector**: 126 features per frame.

## 3. Geometric Normalization
1. **Centering / Origin Translation**:
   $$\mathbf{P}_{norm} = \mathbf{P} - \mathbf{P}_{wrist}$$
2. **Scale Invariance**:
   $$\mathbf{P}_{scaled} = \frac{\mathbf{P}_{norm}}{\max(\|\mathbf{P}_{norm}\|)}$$

## 4. Temporal Sequence Buffering
- **Window Length ($T$)**: 30 consecutive frames (~1.0 second gesture window).
- **Tensor Shape**: `(Batch_Size, 30, 126)`
