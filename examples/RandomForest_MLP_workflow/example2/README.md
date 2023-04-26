# example2 Workflow Description 
The following description will tell the user how to prepare and execute the workflow for a succesfull
repreat of the original experiment.

example2.CWF can be imported into CWL design studio.

## Environment
For the execution environment, you are going to need a linux based machine with [cwltool](https://github.com/common-workflow-language/cwltool)
installed on it. Additionally, you will also need [docker](https://docs.docker.com/engine/install/) installed to be able to run
the containerized computing elements.

## Description

### example2
![alt text](example2.png?raw=true)


### Required inputs
 - fetch_raw_data : data/data.csv; in this example, a subset of iris dataset is used.


### Generated outputs
 - RF_ouput : accuracy score
 - MLP_ouput : accuracy score


## Execution
To run the workflow, you need to give the following command:
```
cwltool --no-match-user --no-read-only --preserve-environment LEAP_CLI_DIR example2.cwl.json --fetch_raw_data data/data.csv 
```
