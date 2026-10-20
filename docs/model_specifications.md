# CNN-BiLSTM with Attention Model Specifications

## Project Model Architecture Definition

The core ISL Gesture Recognition Model consists of four coordinated components:

### 1. Convolutional Spatial Feature Extraction (1D-CNN)
- **Input Dimension**: `(Batch, 30, 126)`
- **Conv1D Layer 1**: 64 filters, Kernel size 3, ReLU activation, Padding='same'
- **Conv1D Layer 2**: 128 filters, Kernel size 3, ReLU activation, Padding='same'
- **Spatial Dropout**: Rate = 0.3

### 2. Bidirectional Temporal Modeling (BiLSTM)
- **BiLSTM Layer 1**: 128 hidden units (Forward: 64, Backward: 64), `return_sequences=True`
- **BiLSTM Layer 2**: 64 hidden units (Forward: 32, Backward: 32), `return_sequences=True`

### 3. Temporal Self-Attention Mechanism
Computes normalized alignment scores for each temporal step:
$$e_t = \tanh(W_a h_t + b_a)$$
$$\alpha_t = \frac{\exp(e_t^T v_a)}{\sum_{k=1}^{T} \exp(e_k^T v_a)}$$
$$c = \sum_{t=1}^{T} \alpha_t h_t$$
where $h_t$ is the BiLSTM hidden state at timestep $t$, $\alpha_t$ is the attention weight, and $c$ is the dynamic context vector.

### 4. Classification Head
- **Dense Layer**: 128 units, ReLU activation
- **Dropout**: Rate = 0.4
- **Output Layer**: $N$ units (Number of ISL classes), Softmax activation
- **Loss Function**: Categorical Crossentropy / Label Smoothing Crossentropy

## Model Weights Directory
All trained weights must be placed in `ml_model/weights/`.
Supported formats:
- `isl_cnn_bilstm_attention.keras` or `.h5`
- `isl_cnn_bilstm_attention.pth` or `.pt`
- `label_classes.json`
