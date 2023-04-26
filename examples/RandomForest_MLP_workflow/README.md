# Examples of using CWL to build ML training workflow
The repository contains examples of using CWL to build ML workflows

# Example 1
**Dataset**: a subset of Iris dataset

**Model**: random forest

**Data preprocessing**: the workflow constains an independent step of preprocessing data. In the example, target values are replaced with numerical targets. 

# Example 2
**Dataset**: a subset of Iris dataset

**Model**: multilayer perceptron (MLP); random forest. In this example, two ML models are trained in parallel given the same input.

**Data preprocessing**: the workflow constains an independent step of preprocessing data. In the example, target values are replaced with numerical targets. 

# Build docker
# Example 1
```
https://github.com/BaitingLuo/CWL_example.git

docker build -t example1:latest .

cd example1

cwltool --no-match-user --no-read-only --preserve-environment LEAP_CLI_DIR example1.cwl.json --FileInput data/data.csv
```

# Example 2
```
https://github.com/BaitingLuo/CWL_example.git

docker build -t example2:latest .

cd example2

cwltool --no-match-user --no-read-only --preserve-environment LEAP_CLI_DIR example2.cwl.json --FileInput data/data.csv
```


# Upload docker
For others to execute your workflow, the docker built on local machine needs to be uploaded to dockerhub.
```
docker login -u <your_docker_id> --password <your_docker_password>

docker build -t <your_docker_id>/<image_name>:<image_version> .

docker push <your_docker_id>/<image_name>
```
