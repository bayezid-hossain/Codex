import pandas as pd
import numpy as np


def calculate_atr_trailing_stops(
    data, fast_period=5, slow_period=10, fast_multiplier=0.5, slow_multiplier=3
):
    """
    Calculates Fast and Slow ATR trailing stops and adds them to a DataFrame.

    Args:
        data (pd.DataFrame): DataFrame containing OHLC data with 'high', 'low', 'close' columns
        fast_period (int): Period for Fast ATR calculation
        slow_period (int): Period for Slow ATR calculation
        fast_multiplier (float): Multiplier for Fast ATR
        slow_multiplier (float): Multiplier for Slow ATR

    Returns:
        pd.DataFrame: DataFrame with ATR trailing stops added
    """
    # Calculate True Range
    df = data.copy()
    df["tr"] = np.maximum(
        np.maximum(df["high"] - df["low"], np.abs(df["high"] - df["close"].shift(1))),
        np.abs(df["low"] - df["close"].shift(1)),
    )

    # Calculate ATR
    df["atr_fast"] = df["tr"].rolling(window=fast_period).mean()
    df["atr_slow"] = df["tr"].rolling(window=slow_period).mean()

    # Calculate ATR Stop Loss values
    df["SL1"] = fast_multiplier * df["atr_fast"]
    df["SL2"] = slow_multiplier * df["atr_slow"]

    # Initialize Trail columns
    df["Fast_Trail"] = 0.0
    df["Slow_Trail"] = 0.0

    # Calculate Fast Trail (Trail1)
    for i in range(1, len(df)):
        prev_fast_trail = df["Fast_Trail"].iloc[i - 1]
        curr_close = df["close"].iloc[i]
        prev_close = df["close"].iloc[i - 1]
        curr_sl1 = df["SL1"].iloc[i]

        if curr_close > prev_fast_trail and prev_close > prev_fast_trail:
            df.loc[df.index[i], "Fast_Trail"] = max(
                prev_fast_trail, curr_close - curr_sl1
            )
        elif curr_close < prev_fast_trail and prev_close < prev_fast_trail:
            df.loc[df.index[i], "Fast_Trail"] = min(
                prev_fast_trail, curr_close + curr_sl1
            )
        elif curr_close > prev_fast_trail:
            df.loc[df.index[i], "Fast_Trail"] = curr_close - curr_sl1
        else:
            df.loc[df.index[i], "Fast_Trail"] = curr_close + curr_sl1

    # Calculate Slow Trail (Trail2)
    for i in range(1, len(df)):
        prev_slow_trail = df["Slow_Trail"].iloc[i - 1]
        curr_close = df["close"].iloc[i]
        prev_close = df["close"].iloc[i - 1]
        curr_sl2 = df["SL2"].iloc[i]

        if curr_close > prev_slow_trail and prev_close > prev_slow_trail:
            df.loc[df.index[i], "Slow_Trail"] = max(
                prev_slow_trail, curr_close - curr_sl2
            )
        elif curr_close < prev_slow_trail and prev_close < prev_slow_trail:
            df.loc[df.index[i], "Slow_Trail"] = min(
                prev_slow_trail, curr_close + curr_sl2
            )
        elif curr_close > prev_slow_trail:
            df.loc[df.index[i], "Slow_Trail"] = curr_close - curr_sl2
        else:
            df.loc[df.index[i], "Slow_Trail"] = curr_close + curr_sl2

    return df


# Example usage
if __name__ == "__main__":
    # Assuming you have your closing price data in a DataFrame named 'data' with a 'close' column
    data = pd.DataFrame(
        {
            "close": [10, 11, 12, 11, 13, 14, 13],
            "high": [14, 13, 12, 18, 15, 19, 16],
            "low": [8, 7, 9, 10, 11, 9, 7],
        }
    )
    data_with_atr = calculate_atr_trailing_stops(data.copy())
    print(data_with_atr)
