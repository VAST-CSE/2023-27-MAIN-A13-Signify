# Smart Indian Sign Language (ISL) Communication Assistant

An AI-assisted web application designed to support communication between Indian Sign Language (ISL) users and hearing individuals through sign recognition, English-to-ISL conversion, interactive learning, and emergency assistance.

## About the Project

Communication between people who use Indian Sign Language and those unfamiliar with it can be challenging. The Smart ISL Communication Assistant aims to reduce this barrier using Artificial Intelligence, Computer Vision, Deep Learning, and Natural Language Processing.

The system is designed to support two-way communication, allowing ISL gestures to be translated into English and English text or speech to be converted into visual ISL representations. It also includes an ISL learning module and a proposed emergency assistance feature.

## Key Features

### 1. ISL Recognition Module

* Captures live video through a webcam.
* Uses MediaPipe Holistic to extract hand, pose, and facial landmarks.
* Prepares landmark sequences for gesture recognition.
* Uses the proposed CNN-BiLSTM with Attention architecture for continuous sign recognition.
* Converts recognized ISL glosses into English sentences using NLP.
* Supports spoken output through Text-to-Speech (TTS).
* Checks recognized signs for predefined emergency gestures.

### 2. English/Speech-to-ISL Module

* Accepts English text or speech as input.
* Uses Whisper Automatic Speech Recognition (ASR) for speech-to-text conversion when configured.
* Processes English text into an ISL representation.
* Generates a gloss sequence using the available mapping resources.
* Displays visual sign output using the sign sequence renderer.

### 3. Learning Support Module

* Provides lessons for learning Indian Sign Language.
* Captures learners' gestures through a webcam.
* Extracts landmarks using MediaPipe.
* Compares learner gestures with reference sign sequences using Dynamic Time Warping (DTW).
* Generates practice feedback based on gesture similarity.

### 4. Emergency Assistance

* Checks recognized glosses for predefined emergency signs.
* Is designed to obtain the user's location when permission and location services are available.
* Supports an emergency alert workflow using an SMS gateway.
* Is intended to provide alert delivery confirmation when supported by the configured service.

Actual emergency detection, GPS access, SMS delivery, and confirmation must be implemented and tested before being considered operational.

## System Architecture

The system consists of three main modules connected through a shared application architecture.

### Module 1: ISL Recognition

**Workflow:**

Webcam Video Capture → MediaPipe Holistic → Landmark Extraction and Normalization → CNN Feature Extraction → BiLSTM + Attention + CTC Decoder → ISL Gloss Sequence

The recognized gloss sequence is checked for predefined emergency gestures.

* **If an emergency gesture is detected:** The system proceeds to the emergency assistance workflow.
* **If no emergency gesture is detected:** The gloss sequence is processed into an English sentence using Transformer-based NLP, followed by optional Text-to-Speech output.

**Emergency workflow:**

Emergency Gesture Detection → GPS and SMS Gateway → Location Sharing → Alert and Confirmation to Contact

### Module 2: English/Speech-to-ISL

**Workflow:**

Speech/Text Input → Whisper ASR (Speech-to-Text, when speech is provided) → Text Processing → Gloss Sequence Generator → Sign Sequence Renderer → ISL Video Output

This module is intended to convert English input into a visual ISL representation using available gloss mappings and sign resources.

### Module 3: Learning Support

**Workflow:**

Learner's Practice Gesture → MediaPipe Landmark Extraction → Reference Sign Database → DTW Similarity Scoring → Feedback Generator

This module compares a learner's gesture with stored reference sequences and provides feedback based on the comparison.

### Shared Resources

The following resources support the proposed architecture:

* **Gloss Mapping Engine:** Maps glosses to English meanings using available dictionary and grammar rules.
* **Reference Sign Database:** Stores reference sign sequences for gesture comparison and learning.
* **Speech Processing:** Supports speech-to-text and text-to-speech operations.
* **Sign Sequence Renderer:** Displays the visual representation of ISL signs.

The architecture describes the intended design. The availability and completeness of each component depend on the actual implementation, trained models, datasets, and configured services.

## Technology Stack

| Component                   | Technology                                    |
| --------------------------- | --------------------------------------------- |
| Frontend                    | React, Vite, JavaScript, CSS                  |
| Backend                     | Python, FastAPI, Uvicorn                      |
| Computer Vision             | MediaPipe Holistic                            |
| Deep Learning               | CNN-BiLSTM with Attention                     |
| Sequence Decoding           | CTC Decoder                                   |
| Natural Language Processing | Transformer-based gloss-to-English processing |
| Speech Recognition          | Whisper ASR                                   |
| Speech Output               | Text-to-Speech (TTS)                          |
| Gesture Comparison          | Dynamic Time Warping (DTW)                    |
| API Communication           | HTTP/REST                                     |

The table describes the technologies planned for the system; not every component is necessarily integrated yet.

## Project Structure

```text
isl assistant/
├── backend/
│   ├── api/
│   ├── schemas/
│   └── main.py
├── config/
├── database/
├── docs/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── utils/
├── ml_model/
├── nlp/
├── preprocessing/
├── speech/
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

This is a summary of the project structure. Individual files may vary depending on the current implementation.

## Requirements

* Python 3.11 is recommended for the existing machine-learning environment.
* Node.js and npm.
* A modern web browser.
* A webcam for gesture capture and practice.
* Python dependencies listed in `requirements.txt`.
* Frontend dependencies listed in `frontend/package.json`.

Additional models, datasets, or external services may be required for individual features.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```powershell
cd "isl assistant"
```
 

### 2. Set Up the Python Environment

Create a virtual environment if one does not already exist:

```powershell
python -m venv .venv
```

Activate it in Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```powershell
pip install -r requirements.txt
```

### 3. Start the Backend

Run this command from the project root:

```powershell
python -m uvicorn backend.main:app --reload
```

The backend should be available at:

* **Backend:** `http://127.0.0.1:8000/`
* **API documentation:** `http://127.0.0.1:8000/docs`

If the application provides a health endpoint, it can be used to check backend availability.

### 4. Start the Frontend

Open a second terminal and navigate to the frontend directory:

```powershell
cd "C:\isl assistant\frontend"
```

Install the frontend dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Open the local URL displayed by Vite. The default development address is:

`http://localhost:5173/`

Keep both the frontend and backend servers running while testing features that depend on the API.

### 5. Camera Access

Allow camera access when prompted by the browser. If the camera does not work, check browser permissions and ensure that another application is not exclusively using the webcam.

## Model and Dataset Requirements

The proposed CNN-BiLSTM with Attention recognition pipeline requires a trained model, compatible weights, and the correct class labels.

The model's input shape must match the landmark preprocessing pipeline used during training. The training configuration must also match the sequence length, feature dimensions, and decoding method.

A suitable labelled ISL dataset is required for training and evaluation. Recognition results should be generated through actual model inference rather than hardcoded or simulated predictions.

## Current Implementation Status

The project contains a React frontend, a FastAPI backend, and a webcam-based landmark-processing workflow.

The following components require verification against the current code and available resources:

* Integration of trained CNN-BiLSTM model weights.
* End-to-end continuous sign recognition.
* Conversion of recognized glosses into grammatically correct English sentences.
* Integration of the Transformer-based NLP component.
* Complete English/speech-to-ISL visual generation.
* Reference-based gesture comparison and learning feedback.
* Emergency sign detection and actual GPS/SMS alert delivery.

The availability of the frontend, camera, or backend API does not by itself confirm that all recognition and translation features are working.


## Future Enhancements

* Train and evaluate the CNN-BiLSTM with Attention model using a suitable ISL dataset.
* Improve continuous sign recognition and English sentence generation.
* Expand the supported ISL vocabulary.
* Evaluate signer-independent recognition.
* Improve English-to-ISL visual generation.
* Expand interactive lessons and gesture feedback.
* Complete and test emergency assistance.
* Improve accessibility, responsiveness, and performance.

## Academic Project Details

**Project Title:** Smart Indian Sign Language (ISL) Communication Assistant Using CNN-BiLSTM with Attention

**Department:** Computer Science and Engineering

**Institution:** Vidya Academy of Science and Technology

**Project Guide:** Ms. Umasree A. K.

### Project Team

| Name             | Register Number |
| ---------------- | --------------- |
| Aleena K. Davis  | VAS23CS034      |
| Andriya C. J.    | VAS23CS049      |
| Anjana O. S.     | VAS23CS051      |
| Annmariya Wilson | VAS23CS056      |

## Conclusion

The Smart ISL Communication Assistant aims to make communication between ISL users and hearing individuals more accessible through sign recognition, English-to-ISL conversion, interactive learning, and emergency assistance.

The project combines computer vision, deep learning, natural language processing, and speech technologies in a modular architecture. Its effectiveness will depend on the successful integration, training, and evaluation of the required models and supporting services.
