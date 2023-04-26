# example1 Workflow Description 
The following description will tell the user how to prepare and execute the workflow for a succesfull
repreat of the original experiment.

example1.CWF can be imported into CWL design studio.

## Environment
For the execution environment, you are going to need a linux based machine with [cwltool](https://github.com/common-workflow-language/cwltool)
installed on it. Additionally, you will also need [docker](https://docs.docker.com/engine/install/) installed to be able to run
the containerized computing elements.

## Description

### example1
![alt text](example1.png?raw=true)

### Required inputs
 - FileInput : data/data.csv


### Generated outputs
 - FileOutput : a text file contains classification accuracy.


## Execution
To run the workflow, you need to give the following command:
```
cwltool --no-match-user --no-read-only --preserve-environment LEAP_CLI_DIR example1.cwl.json --FileInput ... 

Replace ... with the dataset, which is a file. In our example, it is data/data.csv
```
