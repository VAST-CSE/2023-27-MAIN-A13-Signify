# Smart Indian Sign Language (ISL) Communication Assistant using CNN-BiLSTM with Attention

🎓 **Final-Year College Engineering Project**  
AI-Powered Two-Way Communication System between Indian Sign Language (ISL) Users and Hearing Individuals.

---

## 1. Project Overview

Indian Sign Language (ISL) is the primary visual language for millions of Deaf and hard-of-hearing citizens across India. Unlike spoken Indian languages, ISL has distinct grammar, Subject-Object-Verb (SOV) sentence structuring, two-handed finger-spelling, and rich spatial hand-pose markers.

This project delivers a **bidirectional AI-assisted communication bridge**:
- **Forward Pipeline (Signer → Hearing User)**: Real-time video input $\rightarrow$ MediaPipe coordinate extraction $\rightarrow$ **CNN-BiLSTM with Temporal Attention** gesture classification $\rightarrow$ Transformer-based NLP grammar correction $\rightarrow$ Synthesized spoken English audio.
- **Reverse Pipeline (Hearing User → Signer)**: Spoken voice or typed English $\rightarrow$ Speech-to-Text transcription $\rightarrow$ ISL linguistic tokenization $\rightarrow$ Visual ISL gesture cues.

> [!IMPORTANT]
> **Model Integrity Rule**: The core recognition architecture strictly utilizes **CNN-BiLSTM with Attention**. Generic cloud AI (e.g. ChatGPT / Gemini) is **not** used to replace the custom neural network. In this initial stage, no fake predictions are produced.

---

## 2. System Architecture

```
                          ┌──────────────────────────────────────────────┐
                          │         React Frontend (Vite + CSS)          │
                          │   - Dashboard / Live Status Badges           │
                          │   - ISL → English (Webcam Capture)           │
                          │   - English/Speech → ISL (Mic + Text)        │
                          │   - ISL Learning & Curriculum Hub            │
                          │   - About & Architecture Reference           │
                          └──────────────────────┬───────────────────────┘
                                                 │ HTTP / REST API
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │            FastAPI Backend Engine            │
                          │   - Modular Router Aggregator                │
                          │   - Preprocessing Pipeline Manager           │
                          │   - CNN-BiLSTM Model Integration Layer       │
                          │   - Speech & NLP Service Interfaces          │
                          └──────────────────────┬───────────────────────┘
                                                 │
      ┌──────────────────────┬───────────────────┼───────────────────┬──────────────────────┐
      │                      │                   │                   │                      │
      ▼                      ▼                   ▼                   ▼                      ▼
┌──────────────┐      ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      ┌──────────────┐
│ Preprocessing│      │   ML Model   │    │  NLP Engine  │    │Speech Service│      │   Database   │
│ - MediaPipe  │      │ - CNN-BiLSTM │    │ - Transformer│    │ - Whisper STT│      │ - In-Memory  │
│   Holistic   │      │   + Attention│    │   Gloss-to-  │    │ - Web Speech │      │ - SQLite /   │
│ - Normalizer │      │ - Class Head │    │   Sentence   │    │   TTS API    │      │   Firebase   │
│ - 30-Frame   │      │ - Weights in │    │ - ISL Parser │    │              │      │              │
│   Buffer     │      │   /weights/  │    │              │    │              │      │              │
└──────────────┘      └──────────────┘    └──────────────┘    └──────────────┘      └──────────────┘
```

---

## 3. Folder Structure

```
c:\isl assistant\
├── frontend/                     # Modern React + Vite Frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css             # Unified modern dark design system
│       ├── components/
│       │   ├── Navbar.jsx        # Navigation bar & API status indicator
│       │   ├── Footer.jsx        # System architecture footer
│       │   ├── StatusBadge.jsx   # Status indicator pill
│       │   ├── WebcamCapture.jsx # Webcam streaming & canvas overlay
│       │   └── Card.jsx          # Glassmorphic card container
│       ├── pages/
│       │   ├── Dashboard.jsx     # System overview & module cards
│       │   ├── ISLToEnglish.jsx  # Live webcam gesture recognition interface
│       │   ├── EnglishToISL.jsx  # Speech & text to ISL conversion
│       │   ├── ISLLearning.jsx   # Curriculum & interactive gesture mirror
│       │   └── AboutHelp.jsx     # Architecture guide & documentation
│       ├── services/
│       │   └── api.js            # REST API client
│       └── utils/
│           └── speech.js         # Web Speech API helpers
├── backend/                      # FastAPI Backend Server
│   ├── main.py                   # App entry point, CORS, and /api/health
│   ├── requirements.txt
│   ├── .env.example
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py             # Router aggregator
│   │   ├── isl_routes.py         # /api/isl/recognize & /api/isl/model-info
│   │   ├── nlp_routes.py         # /api/nlp/gloss-to-english & /api/english/to-isl
│   │   ├── speech_routes.py      # /api/speech/transcribe & /api/tts
│   │   └── learning_routes.py    # /api/learning
│   └── schemas/
│       ├── __init__.py
│       └── models.py             # Pydantic request/response models
├── ml_model/                     # CNN-BiLSTM + Attention Integration
│   ├── __init__.py
│   ├── model_interface.py        # Abstract base class interface
│   ├── cnn_bilstm_attention.py   # Model architecture definition
│   ├── model_loader.py           # Model loader looking in weights/
│   └── weights/                  # Directory for trained weight files
│       └── README.md
├── preprocessing/                # Computer Vision & Landmark Extraction
│   ├── __init__.py
│   ├── mediapipe_holistic.py     # MediaPipe Holistic wrapper
│   ├── landmark_extractor.py     # 126-D hand & pose landmark parser
│   ├── normalizer.py             # Origin translation & scale normalization
│   └── sequence_builder.py       # Sliding window sequence buffer (30 frames)
├── nlp/                          # Natural Language Processing
│   ├── __init__.py
│   ├── nlp_service.py            # NLP base interface
│   └── gloss_translator.py       # ISL Gloss <-> English translation
├── speech/                       # Speech Processing
│   ├── __init__.py
│   ├── whisper_service.py        # Whisper STT service abstraction
│   └── tts_service.py            # TTS service wrapper
├── database/                     # Modular Storage Layer
│   ├── __init__.py
│   └── db_interface.py           # In-memory / Firebase abstraction
├── config/                       # Centralized App Configuration
│   ├── __init__.py
│   └── settings.py
├── docs/                         # Technical Specs & Reference
│   ├── architecture.md
│   ├── pipeline_design.md
│   └── model_specifications.md
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 4. Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS Design System (no Tailwind dependencies), Lucide Icons, Web Speech API.
- **Backend**: Python 3.12, FastAPI, Uvicorn, Pydantic v2.
- **Computer Vision**: OpenCV, MediaPipe Holistic.
- **Deep Learning**: CNN-BiLSTM with Temporal Attention (TensorFlow / PyTorch compatible interface).
- **Speech**: OpenAI Whisper abstraction + Web Speech API (STT & TTS).
- **NLP**: Modular Transformer Gloss-to-Sentence Interface.

---

## 5. Installation Instructions

### Prerequisites
- Python 3.10+ (Python 3.12 tested)
- Node.js v18+ (Node.js v22 tested) and npm

### Clone / Navigate to Directory
```bash
cd "c:\isl assistant"
```

---

## 6. Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file (optional, defaults are pre-configured):
```bash
copy .env.example .env
```

---

## 7. Frontend Setup

1. Navigate to the `frontend/` directory and install npm packages:
```bash
cd frontend
npm install
```

---

## 8. How to Run the Application

### Option A: Run Backend Server
In the root directory (`c:\isl assistant`):
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
API docs will be available at `http://127.0.0.1:8000/docs`.

### Option B: Run Frontend Development Server
In a second terminal in `c:\isl assistant\frontend`:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 9. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Diagnostics & module readiness status |
| `GET` | `/api/isl/model-info` | CNN-BiLSTM with Attention architecture metadata |
| `POST` | `/api/isl/recognize` | Process 30-frame landmark sequence |
| `POST` | `/api/nlp/gloss-to-english` | Translate ISL Gloss words into English sentence |
| `POST` | `/api/english/to-isl` | Parse English text into ISL token structures |
| `POST` | `/api/speech/transcribe` | Transcribe audio stream / file |
| `POST` | `/api/tts` | Text-to-Speech synthesis metadata |
| `GET` | `/api/learning` | ISL learning curriculum catalog |

---

## 10. Where to Place the Trained CNN-BiLSTM + Attention Model

Place your trained model files into:
```
ml_model/weights/
```

### Supported Formats
- **TensorFlow / Keras**: `isl_cnn_bilstm_attention.keras` or `isl_cnn_bilstm_attention.h5`
- **PyTorch**: `isl_cnn_bilstm_attention.pth` or `isl_cnn_bilstm_attention.pt`
- **Class Labels**: `label_classes.json` (Array of gloss labels corresponding to output softmax indices)

The backend singleton [`ml_model/model_loader.py`](file:///c:/isl%20assistant/ml_model/model_loader.py) automatically detects model files in this folder upon startup.

---

## 11. Current Limitations (Stage 1 Status)

1. **Model Weights**: Deep learning weights for the CNN-BiLSTM + Attention classifier do not exist yet. The system returns honest status responses (`model_not_loaded`) with zero fake predictions.
2. **Transformer NLP Model**: Fine-tuned sequence-to-sequence weights (e.g. T5 ISL model) are not yet integrated; raw token pass-through is utilized.
3. **ISL Visual Avatar**: Reverse pipeline generates structured ISL token tags; 3D animated mesh rendering is scheduled for future work.

---

## 12. Future Development Stages

- **Stage 2**: Collect MediaPipe landmark dataset across 50+ standard ISL vocabulary gestures.
- **Stage 3**: Train CNN-BiLSTM with Temporal Attention on GPU and export `.keras` / `.pth` weights.
- **Stage 4**: Fine-tune a lightweight sequence-to-sequence Transformer for ISL Gloss $\rightarrow$ English grammatical restructuring.
- **Stage 5**: Integrate Three.js / WebGL 3D avatar for visual gesture animation in the reverse pipeline.
