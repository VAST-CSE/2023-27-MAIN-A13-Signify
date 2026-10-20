# System Architecture - Smart ISL Communication Assistant

## Final-Year College Project Architecture Overview

```
                          ┌──────────────────────────────────────────────┐
                          │         React Frontend (Vite + CSS)          │
                          │   - Dashboard / Status Indicators            │
                          │   - ISL → English (Webcam + Preview)         │
                          │   - English/Speech → ISL (Mic + Text)        │
                          │   - ISL Learning & Curriculum Hub            │
                          │   - About & Technical Reference              │
                          └──────────────────────┬───────────────────────┘
                                                 │ HTTP / REST API
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │            FastAPI Backend Engine            │
                          │   - Health & Module Diagnostic Engine        │
                          │   - Preprocessing Pipeline Dispatcher        │
                          │   - Model Interface & Inference Manager      │
                          │   - NLP & Speech Abstraction Gateway         │
                          └──────────────────────┬───────────────────────┘
                                                 │
      ┌──────────────────────┬───────────────────┼───────────────────┬──────────────────────┐
      │                      │                   │                   │                      │
      ▼                      ▼                   ▼                   ▼                      ▼
┌──────────────┐      ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      ┌──────────────┐
│ Preprocessing│      │   ML Model   │    │  NLP Engine  │    │Speech Service│      │   Database   │
│ - MediaPipe  │      │ - CNN-BiLSTM │    │ - Transformer│    │ - Whisper STT│      │ - In-Memory  │
│   Holistic   │      │   + Temporal │    │   Gloss-to-  │    │ - Web Speech │      │ - SQLite /   │
│ - Hand/Pose  │      │   Attention  │    │   Sentence   │    │   TTS API    │      │   Firebase   │
│ - Normalizer │      │ - Class Head │    │ - ISL Parser │    │              │      │              │
│ - Sequence   │      │ - Weights in │    │              │    │              │      │              │
│   Buffer     │      │   /weights/  │    │              │    │              │      │              │
└──────────────┘      └──────────────┘    └──────────────┘    └──────────────┘      └──────────────┘
```

## Forward Pipeline (ISL Video → Spoken English)
1. **Webcam Video Stream**: Captures user signing at 30 FPS.
2. **MediaPipe Holistic**: Extracts 21 3D Left Hand, 21 3D Right Hand, and 33 Pose landmarks.
3. **Normalization**: Root-centers coordinates and normalizes scale by hand span.
4. **Sequence Builder**: Buffers 30 consecutive normalized frames (`30 x 126`).
5. **CNN-BiLSTM with Attention**:
   - 1D-CNN extracts localized temporal spatial features.
   - BiLSTM captures temporal gesture trajectories bidirectionally.
   - Temporal Self-Attention weights crucial transition frames.
   - Softmax layer classifies the gesture into an ISL Gloss word.
6. **Transformer NLP Module**: Reconstructs continuous ISL Gloss tokens into grammatically sound English.
7. **Text-to-Speech (TTS)**: Speaks the English sentence via Web Speech API.

## Reverse Pipeline (English Text/Speech → ISL Visuals)
1. **Speech Input**: Transcribed to English text via Whisper / Web Speech API.
2. **NLP Structural Converter**: Converts Subject-Verb-Object English into ISL Subject-Object-Verb gloss tokens.
3. **Visual Representation**: Maps gloss tokens to sequential visual guide gestures.
