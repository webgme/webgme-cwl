# webgme-cwl
## Installation
First, install the webgme-cwl following:
- [NodeJS](https://nodejs.org/en/) (LTS recommended)
- [MongoDB](https://www.mongodb.com/)

Second, start mongodb locally by running the `mongod` executable in your mongodb installation (you may need to create a `data` directory or set `--dbpath`).

Then, run `webgme start` from the project root to start . Finally, navigate to `http://localhost:8888` to start using webgme-cwl!

## Step usage guide
### Generic
The following rules are for most steps and how they are handling inputs and outputs.
- by default any input will be passed to the command and the prefix will be the name of the port (with '--')
- if you do not want to pass an input to the command, you need to set inside the input's config the 'skip field to true
- also if you do need the that given input you need to use the input config copyTo field and add a path relative to the execution directory
### DockerStep
This step is trying to simplify the execution of any docker based command. The following parameters will complete the step and allow for fine-tuning.
- in the step's config, you can pass any of the 'docker...' fields (dockerPull, etc.) and they will be passed to the CWL files docker requirement as-is.
- this step also uses the config's 'baseCommand' field and use it as-is
