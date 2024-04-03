Custom Logistic Regression Model
================================

Overview
--------

This project features a Python implementation of a logistic regression model from scratch, applied to a binary classification version of the Iris dataset. The logistic regression algorithm is used to predict the probability that a given input point belongs to a certain class. The implementation covers data preprocessing, model training, prediction making, and evaluation of the model's accuracy.

Prerequisites
-------------

- Python 3
- NumPy
- Pandas
- scikit-learn

Components
----------

CustomLogisticRegression Class
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``CustomLogisticRegression`` class encapsulates the logistic regression algorithm, including methods for fitting the model to the data, predicting probabilities, and classifying new examples.

- ``__init__(self, learning_rate=0.01, n_iterations=1000)``

  Initializes the model with a specified learning rate and number of iterations for the gradient descent optimization.

- ``_sigmoid(self, z)``

  Private method implementing the sigmoid function, which maps the input 'z' to a value between 0 and 1, representing the probability of the positive class.

- ``fit(self, X, y)``

  Trains the logistic regression model using gradient descent. It updates the model's weights based on the training data 'X' and the target values 'y'.

- ``predict_proba(self, X)``

  Predicts the probability that each example in 'X' belongs to the positive class.

- ``predict(self, X)``

  Classifies each example in 'X' as belonging to the positive class (1) or the negative class (0), based on the predicted probabilities.

Data Preparation and Model Evaluation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

- Data is loaded and split into training and testing sets.
- Feature scaling is applied to standardize the feature values.
- The custom logistic regression model is instantiated, trained on the training set, and used to make predictions on the test set.
- Model accuracy is evaluated by comparing the predicted class labels against the true labels of the test set.

Usage
-----

To run the logistic regression model:

1. Ensure all prerequisites are installed.
2. Place your binary-class version of the Iris dataset in the same directory as the script and name it ``iris_binary.csv``.
3. Execute the script. The output will include the model's accuracy on the test set.

Abstract Model Requirements
---------------------------

When saving a logistic regression model for future use, such as in a `.pickle` file, it's crucial to ensure the model exposes certain functionalities to enable both retraining and straightforward predictions. This ensures seamless integration and flexibility in various operational environments.

- ``fit(self, X, y)``

  Purpose: Retrain or update the model with new data.

- ``predict(self, X)``

  Purpose: Make predictions using the trained model.

- ``predict_proba(self, X)``

  Optional but Recommended: Provides the probability estimates for each class.

- ``save(self, filepath)``

  Purpose: Efficiently save the model to disk.

- ``load(filepath)``

  Purpose: Static method to load a previously saved model.

Python Implementation
---------------------

.. code-block:: python

    import numpy as np
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    import pandas as pd

    class CustomLogisticRegression:
        def __init__(self, learning_rate=0.01, n_iterations=1000):
            self.learning_rate = learning_rate
            self.n_iterations = n_iterations
            self.weights = None
            self.bias = None

        def _sigmoid(self, z):
            return 1 / (1 + np.exp(-z))

        def fit(self, X, y):
            n_samples, n_features = X.shape
            self.weights = np.zeros(n_features)
            self.bias = 0

            # Gradient Descent
            for _ in range(self.n_iterations):
                model = np.dot(X, self.weights) + self.bias
                predictions = self._sigmoid(model)

                # Compute gradients
                dw = (1 / n_samples) * np.dot(X.T, (predictions - y))
                db = (1 / n_samples) * np.sum(predictions - y)

                # Update parameters
                self.weights -= self.learning_rate * dw
                self.bias -= self.learning_rate * db

        def predict_proba(self, X):
            linear_model = np.dot(X, self.weights) + self.bias
            return self._sigmoid(linear_model)

        def predict(self, X):
            probabilities = self.predict_proba(X)
            return [1 if i > 0.5 else 0 for i in probabilities]

    # Load Iris dataset
    iris = pd.read_csv('iris_binary.csv')

    # Separate features and target
    X = iris.drop('target', axis=1).values
    y = iris['target'].values

    # Split the dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Feature scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Instantiate and train the custom logistic regression model
    model = CustomLogisticRegression(learning_rate=0.01, n_iterations=1000)
    model.fit(X_train_scaled, y_train)

    # Make predictions
    predictions = model.predict(X_test_scaled)

    # Evaluate the model
    accuracy = np.mean(predictions == y_test)
    print(f"Accuracy: {accuracy}")
