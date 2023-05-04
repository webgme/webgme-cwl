=====
Steps
=====

This chapter of the documentation is intended to collect all defined
workflow steps. These detailed description should help both the users
and developers to understand the current capabilities of this design
studio.

List
====
#. :ref:`BuildDockerFromDir <BuildDockerFromDir>`
#. :ref:`Dockerfile <Dockerfile>`
#. :ref:`DockerImage <DockerImage>`
#. :ref:`DockerPull <DockerPull>`
#. :ref:`SAMatlab <SAMatlab>`
#. :ref:`FetchfromPDP <FetchfromPDP>`
#. :ref:`GetFile <GetFile>`
#. :ref:`UnzipFile <UnzipFile>`


Descriptions
============

.. _Step BuildDockerFromDir
BuildDockerFromDir
__________________

This specific step is a shortcut option to allow the user to have a 
computational project (for example python) coupled with a Dockerfile 
that contains the description of the required computational environment. 
The envioronment expects that the Dockerfile exists in the root directory 
(and not in any subdirectories). The step itself accepts two inputs 
(a directory and a string), the project **dir** and the **nametag**. 
It has a single string output **id**, which should be identical to the 
nametag if the building is successful. The step does not require any 
further configuration and once the output is available, the completed 
docker image is ready to use (in a DockerImage step for example). 
The command is running on the executing machine but as it is required to 
have a docker installation, it should not cause any issues.

Dockerfile
_______________

This step builds an image from the configured dockerfile and runs the set 
command with the passed parameters. It does not allow any dynamic behavior 
for the dockerfile, so any specific computational artifact (executable code) 
needed to be provided as an input. In addition to the **dockerfile**, the 
**command**, and the **workdir** shoudl also be configured. As this step is 
dynamic in terms of input and output parameters, the user is required to add 
these ports and define them according their use (check out the hello world 
tutorial for more detailed explanation on these steps).

DockerImage
_______________

This step refers to an image on the executing machine and uses it as the 
environment to run the command. The user needs to provide the **imageId** 
instead of a dockerfile, but all further setup step is identical to the previous 
one.

DockerPull
_______________

This step refers to an image on docker hub (which has to be publicly available) 
and uses it as the environment to run the command. The user needs to provide the **image** 
instead of a dockerfile, but all further setup step is identical to the previous 
one.

SAMatlab
_______________

This is a temaplate step specifically fro standalone matlab project execution. 
It requires a linux build of a matlab project presented as directory input, **app** 
that holds the linux shell script as well as the compiled solution (users should be able 
to use the linux builds as-is). The only configuration requirement for the step is 
to properly set the **version** of the used Matlab. Please note that the user has to 
also add inputs and outputs as needed for correct execution of the matlab functionality. In 
the background, the system will build a special Matlab docker image that will host and 
execute the solution. The inputs all should be positional as that is how Matlab expects 
them. Output refernce works ordinarily (looking for file). At the moment, other types of 
result (like a string) is not supported due to the limitations of CWL, so we advise the user 
to put everything into files or directories.

FetchfromPDP
_______________

This step can grab an artifact stored in the PDP remote storage (for this step, it is configured 
in the used cli application that should be preinstalled on the executing machine, so the model does 
not accept or provide any configuration options in that regard). It is a fixed step, so no port 
manipulation is required to use it. The user is required to provide the **ID** input string pointing 
to the artifact in the PDP and can use the resulting **output** directory. We work with directory 
output as that is the common form of artifacts in the PDP. If one only needs a single file for example, 
that can be grabbed with additional steps in the workflow.

GetFile
________

This step offers a simple way to select a single file from a directory input. To configure the step, 
simply fill out the **fileName** attribute of the step with the name of the required file. After that just 
connect the directory to the **input** port and you can grab the file from the **output** port.

UnzipFile
________

As its name suggest, this step can be used to unzip an archive. The step is going to present the content 
of the archive in a directory, so the user has to accomodate the workflow to that. The step do not require 
any configuration, only the **zip** input file. It is going to provide the result in the **output** directory.