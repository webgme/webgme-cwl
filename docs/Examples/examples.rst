The examples collection of the CWL Design Studio
========================================

The goal
________

The goal of this collection is to provide additional
examples that new users can leverage for the early
learning of the features and how-to's of this
visual modeling environment. In contrary to the 
tutorials and how-to descriptions, these examples
will not focus on the process of the model creation,
rather they will focus on different (real-life) 
scenarios where the use of CWL models gives a boost
to productivity.

Example 1: Building graph classification workflow
==============================================


Problem statement
________

The main goal of this workflow is to provide a graph machine learning framework which predicts the probability of a given compound’s toxicity provided in the form of a graph. This problem setting falls under the well-known task of graph classification. 

Model Input
_____________

The model input comprises a collection of graphs and their corresponding label set, which are structured within a dictionary container with the keys 'graphs' and 'labels'. This dictionary is then serialized in a pickle format. The graphs themselves are represented in Networkx format.


Graph Classification
________________

The graph classification framework consists of two stages, namely (a) graph representation generation, and (b) training of a Random Forest classifier on those generated representations. For the first step, we utilize the newly proposed Distributed Graph Descriptor (DGSD)[1], and NetLSD [2]. DGSD leverages a pair-wise distances approach for computing distances among all pairs of nodes within a given graph. The resulting distance matrix is then used to generate histograms, which serve as the graph representation. NetLSD uses spectral graph properties to generate graph representations. Once these representations have been computed using one of the above descriptor (NetLSD by default), a Random Forest classifier is trained to make predictions based on the generated features. We would like to note that this workflow can be easily updated to incorporate any other graph machine learning approaches such as graph neural networks and graph kernels. 

Implementation details
________________

The implementation uses publicly available netlsd and dgsd python packages, scikit-learn and networkx. The package has been streamlined to main.py, requirement.txt and dockerfile. The docker image can be created as follows.

.. code-block::dos

docker build -t gc_docker:latest .


Create workflow model
______________________________

To understand the basic of the workflow, we refer the reader to  :ref:`domain intro section <The Common Workflow Language modeling language>`


