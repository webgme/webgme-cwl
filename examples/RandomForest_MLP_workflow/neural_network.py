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
# define the neural network
from sklearn.neural_network import MLPClassifier

mlp = MLPClassifier(hidden_layer_sizes=(8,8,8), activation='relu', solver='adam', max_iter=500)
mlp.fit(X_train,y_train)

predict_train = mlp.predict(X_train)
predict_test = mlp.predict(X_test)


from sklearn.metrics import classification_report,confusion_matrix

with open("output2.txt", "a") as f:
    f.write('Result from neural network\n\nClassification Report\n\n{}\n\n'.format(
        classification_report(y_train, predict_train)))
