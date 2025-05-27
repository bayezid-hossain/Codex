import pandas as pd


def calculate_atr_trailing_stops(
    data, fast_period=5, slow_period=10, fast_multiplier=0.5, slow_multiplier=3
):
    """
    Calculates Fast and Slow ATR trailing stops and adds them to a DataFrame.

    Args:
        data (pd.DataFrame): DataFrame containing a 'close' column (required)
        fast_period (int, optional): Period for Fast ATR calculation. Defaults to 5.
        slow_period (int, optional): Period for Slow ATR calculation. Defaults to 10.
        fast_multiplier (float, optional): Multiplier for Fast ATR calculation. Defaults to 0.5.
        slow_multiplier (float, optional): Multiplier for Slow ATR calculation. Defaults to 3.

    Returns:
        pd.DataFrame: Modified DataFrame with 'ATR_Fast', 'ATR_Slow', 'Fast_Trail', and 'Slow_Trail' columns.
    """

    data["ATR_Fast"] = (
        data["close"]
        .rolling(window=fast_period)
        .apply(lambda x: (x - x.mean()).abs().mean() * fast_multiplier, raw=True)
        .fillna(0)
    )
    data["ATR_Slow"] = (
        data["close"]
        .rolling(window=slow_period)
        .apply(lambda x: (x - x.mean()).abs().mean() * slow_multiplier, raw=True)
        .fillna(0)
    )

    fast_trail = pd.Series(index=data.index, dtype="float64")
    slow_trail = pd.Series(index=data.index, dtype="float64")

    for i in range(len(data)):
        current_close = data["close"].iloc[i]
        prev_fast_trail = fast_trail.iloc[i - 1] if i > 0 else 0
        prev_slow_trail = slow_trail.iloc[i - 1] if i > 0 else 0
        atr_fast = data["ATR_Fast"].iloc[i]
        atr_slow = data["ATR_Slow"].iloc[i]
        prev_close = data["close"].iloc[i - 1] if i > 0 else None

        if i > 0:
            if (
                current_close > prev_fast_trail
                and prev_close is not None
                and prev_close > prev_fast_trail
            ):
                fast_trail.iloc[i] = max(prev_fast_trail, current_close - atr_fast)
            elif (
                current_close < prev_fast_trail
                and prev_close is not None
                and prev_close < prev_fast_trail
            ):
                fast_trail.iloc[i] = min(prev_fast_trail, current_close + atr_fast)
            elif current_close > prev_fast_trail:
                fast_trail.iloc[i] = current_close - atr_fast
            else:
                fast_trail.iloc[i] = current_close + atr_fast
        else:
            fast_trail.iloc[i] = current_close - atr_fast  # Initial value

        if i > 0:
            if (
                current_close > prev_slow_trail
                and prev_close is not None
                and prev_close > prev_slow_trail
            ):
                slow_trail.iloc[i] = max(prev_slow_trail, current_close - atr_slow)
            elif (
                current_close < prev_slow_trail
                and prev_close is not None
                and prev_close < prev_slow_trail
            ):
                slow_trail.iloc[i] = min(prev_slow_trail, current_close + atr_slow)
            elif current_close > prev_slow_trail:
                slow_trail.iloc[i] = current_close - atr_slow
            else:
                slow_trail.iloc[i] = current_close + atr_slow
        else:
            slow_trail.iloc[i] = current_close - atr_slow  # Initial value

    data["Fast_Trail"] = fast_trail
    data["Slow_Trail"] = slow_trail
    return data


# Example usage
if __name__ == "__main__":
    # Assuming you have your closing price data in a DataFrame named 'data' with a 'close' column
    data = pd.DataFrame({"close": [10, 11, 12, 11, 13, 14, 13]})
    data_with_atr = calculate_atr_trailing_stops(data.copy())
    print(data_with_atr[["close", "ATR_Fast", "ATR_Slow", "Fast_Trail", "Slow_Trail"]])
