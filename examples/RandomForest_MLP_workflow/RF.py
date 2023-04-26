# imports and definitions
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
#import sys
#file_path = sys.argv[1]
#text = sys.argv[2]
# for random functions
seed_number = 123

# load the dataset to pandas
filename = "cleaned_data.csv"
df = pd.read_csv(filename, header=0)
# get train/test splits
features = df.iloc[:,:4]
targets = df['species'].to_numpy()
test_proportion = 0.3
X_train, X_test, y_train, y_test = train_test_split(
    features,
    targets,
    test_size=test_proportion,
    stratify=targets,
    random_state=seed_number,
)

# define the model
n_trees = 100
rf = RandomForestClassifier(
    n_estimators=n_trees, oob_score=True, random_state=seed_number
)

# train the model
rf.fit(X_train, y_train)

# score our model and print the output
predicted = rf.predict(X_test)
accuracy = accuracy_score(y_test, predicted)
with open("output.txt", "a") as f:
    f.write(
        "Result from random forest:\n"
        "Out-of-bag score estimate: {0:.3f}\n"
        "Mean accuracy score: {1:.3f}".format(rf.oob_score_, accuracy
        ))

