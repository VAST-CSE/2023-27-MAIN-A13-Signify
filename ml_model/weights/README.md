# ML Model Weights Directory

## Purpose
This directory is the dedicated storage location for trained **CNN-BiLSTM with Attention** model weights.

## Expected Files
When you have trained your CNN-BiLSTM + Attention model, place your weights file here:

- **TensorFlow / Keras format**: `isl_cnn_bilstm_attention.keras` or `isl_cnn_bilstm_attention.h5`
- **PyTorch format**: `isl_cnn_bilstm_attention.pth` or `isl_cnn_bilstm_attention.pt`

## Expected Model Architecture
1. **Input Shape**: `(batch_size, sequence_length=30, num_features=126)`
   - 21 Left Hand Landmarks (x, y, z) = 63 values
   - 21 Right Hand Landmarks (x, y, z) = 63 values
   - (Optional Pose additions if trained on 1662-dim holistic vectors)
2. **CNN Feature Extractor**: 1D Convolutional layers extracting temporal spatial feature vectors.
3. **Bidirectional LSTM**: BiLSTM layer(s) capturing past and future gesture dependencies.
4. **Attention Mechanism**: Temporal / Self-Attention layer assigning dynamic weights to critical gesture transition frames.
5. **Classification Head**: Dense softmax layer outputting probabilities over the ISL gloss vocabulary.

## Model Labels
Ensure a corresponding `label_classes.json` or `classes.txt` is placed here mapping numerical class indices (e.g. `0, 1, 2...`) to ISL Gloss words (e.g. `"HELLO"`, `"THANK YOU"`, `"NAME"`, `"HELP"`, etc.).

## Current Status
> [!NOTE]
> At this stage, NO trained weights file is placed here. The application interface safely checks for the presence of weights in this directory and informs the user/system cleanly.
