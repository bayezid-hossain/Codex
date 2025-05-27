import subprocess
import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import time
from anomaly_detection.config import Config
from anomaly_detection.database import DatabaseHandler
import os
import sys

# Configuration
DB_HANDLER = DatabaseHandler(
    Config.DB_NAME,
    Config.DB_USER,
    Config.DB_PASSWORD,
    Config.DB_HOST,
    Config.DB_PORT,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPDATE_INTERVAL = 2  # seconds
TABLE_NAME = Config.TABLE_NAME
WINDOW_LIMIT = 3000

if "execute_flag" not in st.session_state:
    st.session_state.execute_flag = False


def execute_scripts():
    """Execute the data generation and prediction scripts."""
    # Always check state, don't rely on the calling function to check

    subprocess.Popen(
        [
            sys.executable,
            os.path.join(BASE_DIR, "anomaly_detection", "predictor.py"),
        ]
    )
    time.sleep(3)
    subprocess.Popen(
        [
            sys.executable,
            os.path.join(BASE_DIR, "anomaly_detection", "data_generator.py"),
        ]
    )
    print("executing")
    time.sleep(1)


def get_data() -> pd.DataFrame:
    data = DB_HANDLER.fetch_new_data(TABLE_NAME, limit=WINDOW_LIMIT)

    if data is not None:
        data = pd.DataFrame(data)
        # Convert 'isanomaly' to boolean and ensure 'date' is datetime
        data["isanomaly"] = data["isanomaly"].astype(str).str.lower() == "true"
        data["date"] = pd.to_datetime(data["date"])
        print(data)
        print("hi")
        return data
    else:
        return None


if __name__ == "__main__":
    st.set_page_config(
        page_title="Anomaly Detection",
        page_icon="✅",
        layout="wide",
    )

    with st.sidebar:
        st.header("Configuration")

        # Display current status
        if st.session_state.execute_flag:
            st.success("Execution is already running")
            if st.button("Stop Execution"):
                st.session_state.execute_flag = False
                st.rerun()
        else:
            if st.button("Start Execution"):
                execute_scripts()  # Start the execution scripts
                st.session_state.execute_flag = True

    # Placeholder for the chart (initially empty)
    chart_placeholder = st.empty()

    # Create the figure and axes once, outside the loop
    fig, ax = plt.subplots(figsize=(16, 8))

    while st.session_state.execute_flag:
        # Generating demo data
        np.random.seed(42)
        dates = pd.date_range(start="2023-01-01", periods=100, freq="D")
        high_prices = np.random.uniform(50, 200, size=len(dates))

        # Adding anomalies (randomly choosing 5 points to be anomalies)
        anomalies = np.random.choice([True, False], size=len(dates), p=[0.05, 0.95])
        high_prices[anomalies] += np.random.uniform(
            50, 100, size=anomalies.sum()
        )  # Adding spike for anomalies

        # Creating the DataFrame
        data = pd.DataFrame(
            {"date": dates, "high": high_prices, "isanomaly": anomalies}
        )
        # Plotting the chart with generated data
        fig, ax = plt.subplots(figsize=(10, 6))

        # Plot the data
        ax.plot(data["date"], data["high"], label="Highest Price")
        ax.scatter(
            data[data["isanomaly"]]["date"],
            data[data["isanomaly"]]["high"],
            color="red",
            label="Anomalies",
        )
        ax.set_xlabel("Date")
        ax.set_ylabel("Price")
        ax.set_title("Highest Price Trend with Anomaly Detection")
        ax.legend()

        # Show the plot
        chart_placeholder.pyplot(fig)
        # data = get_data()
        # if data is not None:
        #     # Clear the previous plot
        #     ax.clear()

        #     # Plot the new data
        #     ax.plot(data["date"], data["high"], label="Highest Price")
        #     ax.scatter(
        #         data[data["isanomaly"]]["date"],
        #         data[data["isanomaly"]]["high"],
        #         color="red",
        #         label="Anomalies",
        #     )
        #     ax.set_xlabel("Date")
        #     ax.set_ylabel("Price")
        #     ax.set_title("Highest Price Trend with Anomaly Detection")
        #     ax.legend()

        #     chart_placeholder.pyplot(fig)  # Display the plot

        time.sleep(UPDATE_INTERVAL)
