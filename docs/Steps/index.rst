Steps
=====

This chapter of the documentation is intended to collect all defined
workflow steps. These detailed description should help both the users
and developers to understand the current capabilities of this design
studio.

BuildDockerFromDir
__________________

This specific step is a shortcut option to allow the user to have a 
computational project (for example python) coupled with a Dockerfile 
that contains the description of the required computational environment. 
The step itself accepts two inputs (a directory and a string), the project 
**dir** and the **nametag**. It has a single string output **id**, 
which should be identical to the nametag if the building is successful. 
The step does not require any further configuration and once the output 
is available, the completed docker image is ready to use (in a DickerImage 
step for example). The command is running on the executing machine but as it 
is required to have a docker installation, it should not cause any issues.

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


