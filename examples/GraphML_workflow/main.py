"""
This module automates cwl workflows validation.

Author: Anwar Said
Date: 10th March 2023
"""
import netlsd,dgsd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import networkx as nx
import pickle
from sklearn.model_selection import GridSearchCV,StratifiedKFold
import csv
import sys



file_path = sys.argv[1]

with open(file_path, 'rb') as file:
    dataset = pickle.load(file)

graphs,labels = dataset['graphs'],dataset['labels']
print("dataset loaded successfully!")
print("# of samples:", len(graphs))
print("# of classes:", len(np.unique(labels)))

embeddings = [netlsd.heat(g) for g in graphs]
# embeddings = [dgsd.DGSD().get_descriptor(g) for g in graphs]
embeddings = np.array(embeddings)
print("Embeddings computed successfully! now applying classifier", embeddings.shape)

def apply_RF_Grid(data_X,data_y):
    # num_cores = multiprocessing.cpu_count()
    max_arr = []
    estimator  = RandomForestClassifier(criterion='gini', max_depth=None, min_weight_fraction_leaf=0.0,
                                            max_leaf_nodes=None, bootstrap=True, 
                                            oob_score=False, n_jobs=5,verbose=0, warm_start=False,
                                            class_weight=None)
    for seed in [567,890,5678]:
         
        param_grid = {'n_estimators':[50,100], 'max_features':['sqrt'], 
                      'min_samples_split':[2,5], 'min_samples_leaf':[2]}
        kf = StratifiedKFold(n_splits=5, random_state = seed, shuffle = True)
        grid_rf    = GridSearchCV(estimator, param_grid, scoring='accuracy', n_jobs=5, 
                     refit=True, cv=kf, verbose=1, pre_dispatch='n_jobs', 
                     error_score='raise')

        grid_rf.fit(data_X, data_y)
        max_arr.append(grid_rf.best_score_)

    return np.mean(max_arr)

acc = apply_RF_Grid(embeddings, labels)
print("Classification accuracy with GridSearch Random Forest:", acc)
results = ["acc:",str(acc)]
with open('results.txt', 'w') as f:
    f.writelines(results)

