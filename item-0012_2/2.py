import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
from sklearn.preprocessing import MinMaxScaler

np.random.seed(42)
dates = pd.to_datetime(pd.date_range(start="2023-01-01", periods=100, freq="D"))
values = np.random.rand(100)
df_time_series = pd.DataFrame({"VALUE": values}, index=dates)

# Preprocessing
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(df_time_series.values)

# Define sequence length (lookback window)
sequence_length = 30


# Create input sequences and target values
def create_sequences(data, seq_length):
    xs, ys = [], []
    for i in range(len(data) - seq_length):
        x = data[i : (i + seq_length)]
        y = data[i + seq_length]
        xs.append(x)
        ys.append(y)
    return np.array(xs), np.array(ys)


X, y = create_sequences(scaled_data, sequence_length)

# Split into train and validation sets
train_size = int(len(X) * 0.8)
X_train, X_val = X[:train_size], X[train_size:]
y_train, y_val = y[:train_size], y[train_size:]

# Convert to PyTorch tensors
X_train = torch.tensor(X_train).float()
y_train = torch.tensor(y_train).float()
X_val = torch.tensor(X_val).float()
y_val = torch.tensor(y_val).float()

# Create data loaders
batch_size = 32
train_dataset = torch.utils.data.TensorDataset(X_train, y_train)
train_loader = torch.utils.data.DataLoader(
    train_dataset, batch_size=batch_size, shuffle=True
)
val_dataset = torch.utils.data.TensorDataset(X_val, y_val)
val_loader = torch.utils.data.DataLoader(
    val_dataset, batch_size=batch_size, shuffle=False
)


# --- Modified Transformer Model ---
class TransformerModel(nn.Module):
    def __init__(
        self, input_size, d_model, hidden_size, num_layers, num_heads, dropout=0.1
    ):
        super(TransformerModel, self).__init__()
        self.input_projection = nn.Linear(input_size, d_model)
        self.encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=num_heads,
            dim_feedforward=hidden_size,
            dropout=dropout,
        )
        self.transformer_encoder = nn.TransformerEncoder(
            self.encoder_layer, num_layers=num_layers
        )
        self.decoder = nn.Linear(d_model, 1)
        self.d_model = d_model

    def forward(self, src):
        # Project input to d_model dimensions
        src = self.input_projection(src)
        # Expected shape: [sequence_length, batch_size, d_model]
        if src.shape[0] != self.sequence_length:
            src = src.permute(1, 0, 2)  # [seq_len, batch, features]
        output = self.transformer_encoder(src)
        output = self.decoder(output[-1, :, :])  # Take the last output for prediction
        return output


# Model parameters
input_size = X_train.shape[2]  # Number of features per time step
hidden_size = 64
num_layers = 2
num_heads = 4  # Must be a divisor of d_model
dropout = 0.1
learning_rate = 0.001
num_epochs = 50
# Make sure input_size is divisible by num_heads
d_model = 16  # Choose a value divisible by num_heads (4)
# Initialize model, loss, and optimizer
# Initialize model
model = TransformerModel(
    input_size=input_size,
    d_model=d_model,  # This must be divisible by num_heads
    hidden_size=hidden_size,
    num_layers=num_layers,
    num_heads=num_heads,
    dropout=dropout,
)
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

# Training loop
for epoch in range(num_epochs):
    model.train()
    total_loss = 0
    for batch_x, batch_y in train_loader:
        optimizer.zero_grad()
        output = model(batch_x)
        loss = criterion(output, batch_y)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    avg_loss = total_loss / len(train_loader)

    # Validation
    model.eval()
    with torch.no_grad():
        val_preds = model(X_val)
        val_loss = criterion(val_preds, y_val)

    print(
        f"Epoch [{epoch + 1}/{num_epochs}], Loss: {avg_loss:.4f}, Val Loss: {val_loss.item():.4f}"
    )

# Make predictions (example)
model.eval()
with torch.no_grad():
    last_sequence = (
        torch.tensor(scaled_data[-sequence_length:]).float().unsqueeze(0)
    )  # shape: (1, seq_len, 1)
    prediction = model(last_sequence)

# Inverse transform to get actual values
prediction = scaler.inverse_transform(prediction.numpy())
print(f"Forecast: {prediction}")
