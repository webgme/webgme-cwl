RandomForest Classifier Model with MATLAB and Python Integration
=================================================================

Overview
--------

This example demonstrates how to use MATLAB to train a RandomForest classifier on pre-processed data using Python's scikit-learn library. It includes steps to read the data from CSV files, convert MATLAB matrices to Python objects, train the model, and save it using joblib. This approach leverages Python's machine learning capabilities within the MATLAB environment.

Prerequisites
-------------

- MATLAB (with Python integration configured)
- Python 3
- scikit-learn
- numpy
- joblib

For the effective loading of the correct Python environment, which includes all required libraries, please replace 'path/python' with the actual path to your preferred Python executable. Execute the following command in MATLAB:

.. code-block:: matlab

    pyenv('Version', '/path/to/python', 'ExecutionMode', 'OutOfProcess');

Process Overview
----------------

Data Preparation
----------------

Features (``X_train``) and labels (``Y_train``) are read from CSV files using MATLAB's ``readmatrix`` function.

Model Training
--------------

A RandomForest classifier is instantiated with specified parameters and trained on the dataset.

Model Saving
------------

The trained model is saved to disk using Python's joblib library, allowing for later use without retraining.

Required Functionalities for Model Use
---------------------------------------

Training the Model
~~~~~~~~~~~~~~~~~~

- **MATLAB to Python Conversion:** The script converts MATLAB matrices to Python arrays compatible with scikit-learn using ``py.numpy.array()``.

- **Model Training:** Utilizes scikit-learn's ``RandomForestClassifier`` and its ``fit`` method to train the model on the data.

Saving the Model
~~~~~~~~~~~~~~~~

- **Serialization:** The trained model is serialized and saved to a file using ``py.joblib.dump()``, enabling the model to be loaded and used for predictions in future sessions.

Usage
-----

1. Ensure all prerequisites are met and Python is correctly set up in MATLAB.
2. Place your pre-processed feature matrix and labels in the same directory as the script, named ``X_train.csv`` and ``y_train.csv`` respectively.
3. Run the script in MATLAB to train the RandomForest model and save it as ``trained_model.pkl``.

Saving and Loading the Model in MATLAB
---------------------------------------

Saving the Model
~~~~~~~~~~~~~~~~

The script saves the trained model using Python's joblib:

.. code-block:: matlab

    % Read the pre-processed feature matrix and labels
    X_train = readmatrix('X_train.csv');
    Y_train = readmatrix('y_train.csv');

    model = py.sklearn.ensemble.RandomForestClassifier(pyargs('n_estimators', int32(100), 'random_state', int32(42)));

    % Convert MATLAB matrices to Python objects that fit can work with
    X_train_py = py.numpy.array(X_train);
    Y_train_py = py.numpy.array(Y_train);

    % Train the model
    model.fit(X_train_py, Y_train_py);

    % Save the model using joblib
    py.joblib.dump(model, 'trained_model.pkl');

This documentation encapsulates the workflow and code necessary to leverage Python's scikit-learn RandomForest classifier within MATLAB, offering a guide to integrating these powerful tools for machine learning tasks.
