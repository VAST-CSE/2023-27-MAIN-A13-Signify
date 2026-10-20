export const HAND_LANDMARK_COUNT = 21;
export const POSE_LANDMARK_COUNT = 33;
export const LEFT_HAND_FEATURES = HAND_LANDMARK_COUNT * 3;
export const RIGHT_HAND_FEATURES = HAND_LANDMARK_COUNT * 3;
export const POSE_FEATURES = POSE_LANDMARK_COUNT * 4;
export const TOTAL_FEATURES_PER_FRAME = LEFT_HAND_FEATURES + RIGHT_HAND_FEATURES + POSE_FEATURES;

const EMPTY_POINT = { x: 0, y: 0, z: 0 };
const EMPTY_POSE_POINT = { x: 0, y: 0, z: 0, visibility: 0 };

function toFlatVector(landmarks, expectedCount, pointFactory) {
  const values = Array(expectedCount * 3).fill(0);

  if (!Array.isArray(landmarks) || landmarks.length === 0) {
    return values;
  }

  const points = landmarks.length >= expectedCount ? landmarks.slice(0, expectedCount) : landmarks;

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index] ?? pointFactory();
    const baseIndex = index * 3;
    values[baseIndex] = Number.isFinite(point.x) ? point.x : 0;
    values[baseIndex + 1] = Number.isFinite(point.y) ? point.y : 0;
    values[baseIndex + 2] = Number.isFinite(point.z) ? point.z : 0;
  }

  return values;
}

function toPoseVector(landmarks) {
  const values = Array(POSE_FEATURES).fill(0);

  if (!Array.isArray(landmarks) || landmarks.length === 0) {
    return values;
  }

  const points = landmarks.length >= POSE_LANDMARK_COUNT ? landmarks.slice(0, POSE_LANDMARK_COUNT) : landmarks;

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index] ?? EMPTY_POSE_POINT;
    const baseIndex = index * 4;
    values[baseIndex] = Number.isFinite(point.x) ? point.x : 0;
    values[baseIndex + 1] = Number.isFinite(point.y) ? point.y : 0;
    values[baseIndex + 2] = Number.isFinite(point.z) ? point.z : 0;
    values[baseIndex + 3] = Number.isFinite(point.visibility) ? point.visibility : 0;
  }

  return values;
}

export function buildHolisticFrameVector({ leftHand, rightHand, pose }) {
  const leftHandVector = toFlatVector(leftHand, HAND_LANDMARK_COUNT, EMPTY_POINT);
  const rightHandVector = toFlatVector(rightHand, HAND_LANDMARK_COUNT, EMPTY_POINT);
  const poseVector = toPoseVector(pose);

  const leftHandDetected = Array.isArray(leftHand) && leftHand.length > 0;
  const rightHandDetected = Array.isArray(rightHand) && rightHand.length > 0;
  const hasPose = Array.isArray(pose) && pose.length > 0;

  let handPresence = 'none';
  if (leftHandDetected && rightHandDetected) {
    handPresence = 'both';
  } else if (leftHandDetected) {
    handPresence = 'left';
  } else if (rightHandDetected) {
    handPresence = 'right';
  }

  return {
    leftHand: leftHandVector,
    rightHand: rightHandVector,
    pose: poseVector,
    features: [...leftHandVector, ...rightHandVector, ...poseVector],
    handPresence,
    hasLeftHand: leftHandDetected,
    hasRightHand: rightHandDetected,
    hasPose,
    totalFeatures: TOTAL_FEATURES_PER_FRAME
  };
}
