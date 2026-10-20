import test from 'node:test';
import assert from 'node:assert/strict';
import { buildHolisticFrameVector, HAND_LANDMARK_COUNT, POSE_LANDMARK_COUNT } from './holisticPreprocessor.js';

test('buildHolisticFrameVector pads missing hands and pose with zeros', () => {
  const frame = buildHolisticFrameVector({
    leftHand: null,
    rightHand: [
      { x: 0.1, y: 0.2, z: 0.3 },
      { x: 0.4, y: 0.5, z: 0.6 }
    ],
    pose: [
      { x: 0.7, y: 0.8, z: 0.9, visibility: 0.5 }
    ]
  });

  assert.equal(frame.leftHand.length, HAND_LANDMARK_COUNT * 3);
  assert.equal(frame.rightHand.length, HAND_LANDMARK_COUNT * 3);
  assert.equal(frame.pose.length, POSE_LANDMARK_COUNT * 4);
  assert.equal(frame.handPresence, 'right');
  assert.equal(frame.features.length, HAND_LANDMARK_COUNT * 3 * 2 + POSE_LANDMARK_COUNT * 4);
  assert.ok(frame.features.every((value) => Number.isFinite(value)));
});

test('buildHolisticFrameVector supports both hands and pose data', () => {
  const leftHand = Array.from({ length: 21 }, (_, i) => ({ x: i * 0.01, y: i * 0.02, z: i * 0.03 }));
  const rightHand = Array.from({ length: 21 }, (_, i) => ({ x: i * 0.04, y: i * 0.05, z: i * 0.06 }));
  const pose = Array.from({ length: 33 }, (_, i) => ({ x: i * 0.07, y: i * 0.08, z: i * 0.09, visibility: 0.1 + i * 0.01 }));

  const frame = buildHolisticFrameVector({ leftHand, rightHand, pose });

  assert.equal(frame.handPresence, 'both');
  assert.equal(frame.leftHand[0], 0);
  assert.equal(frame.leftHand[1], 0);
  assert.equal(frame.leftHand[3], 0.01);
  assert.equal(frame.rightHand[3], 0.04);
  assert.ok(Math.abs(frame.pose[132 - 1] - 0.42) < 1e-9);
});

import { appendFrameToSequence, buildTemporalSequence, createEmptySequence, MODEL_SEQUENCE_LENGTH } from './sequencePreprocessor.js';

test('sequence builder produces a fixed-length 30-frame tensor shape', () => {
  const sequence = createEmptySequence();
  const frame = buildHolisticFrameVector({
    leftHand: Array.from({ length: 21 }, (_, i) => ({ x: i * 0.01, y: i * 0.02, z: i * 0.03 })),
    rightHand: Array.from({ length: 21 }, (_, i) => ({ x: i * 0.04, y: i * 0.05, z: i * 0.06 })),
    pose: Array.from({ length: 33 }, (_, i) => ({ x: i * 0.07, y: i * 0.08, z: i * 0.09, visibility: 0.1 + i * 0.01 }))
  });

  let nextSequence = sequence;
  for (let index = 0; index < MODEL_SEQUENCE_LENGTH; index += 1) {
    nextSequence = appendFrameToSequence(nextSequence, frame.features);
  }

  const finalSequence = buildTemporalSequence(nextSequence);

  assert.equal(finalSequence.length, MODEL_SEQUENCE_LENGTH);
  assert.equal(finalSequence[0].length, frame.features.length);
  assert.equal(finalSequence[29].length, frame.features.length);
});
