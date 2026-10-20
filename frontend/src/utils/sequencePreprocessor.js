import { TOTAL_FEATURES_PER_FRAME } from './holisticPreprocessor.js';

export const MODEL_SEQUENCE_LENGTH = 30;
export const FRAME_FEATURE_LENGTH = TOTAL_FEATURES_PER_FRAME;

/**
 * Builds a zero-filled feature vector with a consistent length for each frame.
 * This guarantees that missing hands or pose landmarks do not change the model input size.
 */
export function sanitizeFrameFeatures(frameFeatures) {
  const fallback = Array(FRAME_FEATURE_LENGTH).fill(0);

  if (!Array.isArray(frameFeatures)) {
    return fallback;
  }

  const sanitized = [...frameFeatures].map((value) => (Number.isFinite(value) ? value : 0));

  if (sanitized.length === FRAME_FEATURE_LENGTH) {
    return sanitized;
  }

  const padded = [...sanitized];
  while (padded.length < FRAME_FEATURE_LENGTH) {
    padded.push(0);
  }

  return padded.slice(0, FRAME_FEATURE_LENGTH);
}

/**
 * Normalizes a single frame using the non-zero values in that frame.
 *
 * This keeps feature values comparable across different camera distances and positions.
 * Missing landmark values remain zero, which preserves the fixed feature dimension.
 */
export function normalizeFrameFeatures(frameFeatures) {
  const sanitized = sanitizeFrameFeatures(frameFeatures);
  const activeValues = sanitized.filter((value) => value !== 0);

  if (activeValues.length === 0) {
    return sanitized;
  }

  const mean = activeValues.reduce((sum, value) => sum + value, 0) / activeValues.length;
  const variance = activeValues.reduce((sum, value) => sum + (value - mean) ** 2, 0) / activeValues.length;
  const std = Math.sqrt(variance) || 1;

  return sanitized.map((value) => (value === 0 ? 0 : (value - mean) / std));
}

/**
 * Appends a frame to the temporal buffer and keeps the most recent 30 frames only.
 * The final buffer is ordered as Frame 1 -> Frame 2 -> ... -> Frame 30.
 */
export function appendFrameToSequence(sequence, frameFeatures) {
  const normalizedFrame = normalizeFrameFeatures(frameFeatures);
  const nextSequence = [...(Array.isArray(sequence) ? sequence : []), normalizedFrame];

  if (nextSequence.length > MODEL_SEQUENCE_LENGTH) {
    nextSequence.splice(0, nextSequence.length - MODEL_SEQUENCE_LENGTH);
  }

  return nextSequence;
}

/**
 * Produces a fixed-length 2D tensor-like sequence of shape (30, num_features).
 * If there are fewer than 30 frames, the missing values are zero-padded at the front.
 */
export function buildTemporalSequence(frames) {
  const normalizedFrames = Array.isArray(frames)
    ? frames.map((frame) => normalizeFrameFeatures(frame))
    : [];

  const paddedFrames = [...normalizedFrames];

  while (paddedFrames.length < MODEL_SEQUENCE_LENGTH) {
    paddedFrames.unshift(Array(FRAME_FEATURE_LENGTH).fill(0));
  }

  return paddedFrames.slice(-MODEL_SEQUENCE_LENGTH).map((frame) => sanitizeFrameFeatures(frame));
}

/**
 * Resets the in-memory temporal buffer for a new sign sample.
 */
export function createEmptySequence() {
  return [];
}

/**
 * Convenience metadata for the future model integration.
 */
export function getSequenceMetadata(sequence) {
  const currentLength = Array.isArray(sequence) ? sequence.length : 0;

  return {
    sequenceLength: MODEL_SEQUENCE_LENGTH,
    featureCount: FRAME_FEATURE_LENGTH,
    currentLength,
    complete: currentLength >= MODEL_SEQUENCE_LENGTH,
    shape: [MODEL_SEQUENCE_LENGTH, FRAME_FEATURE_LENGTH]
  };
}
