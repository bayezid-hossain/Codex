import time
from bayes_opt import BayesianOptimization
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import roc_auc_score
import pandas as pd

start_time = time.time()


def load_data_set(filename):
    try:
        return pd.read_csv(filename)
    except Exception as e:
        print(e)


def internal_method(C):
    model = SVC(C=C, probability=True)  # Need probability=True for roc_auc_score
    model.fit(X_train_scaled, y_train)
    y_score = model.predict_proba(X_test_scaled)[
        :, 1
    ]  # Get probabilities for the positive class
    f = roc_auc_score(y_test, y_score)
    return f


test_dataset = load_data_set("car_speeding_tickets.csv")

# Use the actual column names from your CSV
X = test_dataset[["speed"]]
y = test_dataset["expected_result"]

X_trn, X_tst, y_train, y_test = train_test_split(X, y, stratify=y, random_state=12)

min_max_sclr = MinMaxScaler()
X_train_scaled = min_max_sclr.fit_transform(X_trn)
X_test_scaled = min_max_sclr.transform(X_tst)

bds = {"C": (0.1, 15)}  # Use a tuple for pbounds

optimizer = BayesianOptimization(
    f=internal_method, pbounds=bds, random_state=7, verbose=2
)

# You'll likely want to set n_iter to a reasonable value
optimizer.maximize(init_points=2, n_iter=10)

print("Best parameters:", optimizer.max)
print("Time taken: {:.2f} seconds".format(time.time() - start_time))

from hyperopt import hp

learning_rate_space = hp.uniform("learning_rate", 0.01, 1)
num_hidden_units_space = hp.quniform("num_hidden_units", 10, 100, 1)

search_space = [learning_rate_space, num_hidden_units_space]

from skopt.space import Real, Integer, Categorical

learning_rate_space = Real(0.01, 1, name="learning_rate")
num_hidden_units_space = Integer(10, 100, name="num_hidden_units")

search_space = [learning_rate_space, num_hidden_units_space]
