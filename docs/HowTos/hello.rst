The Hello World of the CWL Design Studio
========================================

The goal
________

The aim of this hello world example is as all
such examples is to introduce a comprehensive yet 
easy to build example for the user exemplifying the 
main use-case of the whole design studio.

This is an end-to-end example in the sense that it starts
shortly describing how the dockerization of scripts should go 
and ending with noting the execution of a composed workflow 
using the standrard implementation of the CWL framework 
`cwltool <https://github.com/common-workflow-language/cwltool>`_ 
. All necessary files can be found in our
`repository <https://github.com/webgme/webgme-cwl/tree/master/tutorials/hello>`_ 
. The hello world will follow the docerization of a few arbitrary, though 
simple script - in our case written in javascript - then show different ways 
how they might get called in a workflow step. This way we aim cover the 
most essential issues that new users might face when they try to wrap their 
work in a workflow.

The environment
_______________ 

To be able to successfully complete the example, your computer needs a few 
software to be installed - we will not discuss the deployment of the Design 
Studio (DS) itself as we write our example from the perspective of the end-user 
of the DS. So, to run the built workflow of this example, you are going to need:

- `docker <https://www.docker.com/>`_
- `cwltool <https://github.com/common-workflow-language/cwltool#install>`_

Dockerize your computation 
___________________________ 

Before we can begin to model any simple or complex workflows, we need to ensure 
that our computational portions are dockerized to ensure maximum compatibility 
and portability. While techincally CWL can compose commands of the hosting system 
it would require tedious preparation of execution environment if we were to 
allow that.

Wrapping your work in a docker environment can be hard and is most probably unique 
as each compute process is unique. That means we cannot provide a step-by-step 
guide on how to do it, but there are sources that most probably will help get 
this part of the job done:

- `MatLab <https://www.mathworks.com/help/compiler/package-matlab-standalone-applications-into-docker-images.html>`_
- `Python <https://www.docker.com/blog/containerized-python-development-part-1/>`_
- `Javascript <https://docs.docker.com/get-started/02_our_app/>`_

In addition to these guides, here are a few key idea that you should 
follow to achieve maximal portability and reproducability with your work:

- fixed versions: Starting with the base image, always try to use fixed 
versions of software when you build your dockerfile allowing for exact 
re-execution later. This also means that you should avoid using generic 
update and upgrade commands as part of your description as they will 
not guarantee to keep all your packages on a certain version.
- use image instead of dockerfile: While the dockerfile is certainly 
more portable than the full docker image, sometimes it is just impossible 
to describe your environment in a text file, as you reached the 
perfect balance by a manual tweaking of your container. Sharing the 
image will also ensure that the versions remain the same.
- avoid licences: In general, you should handle your computing 
images as public, but there are certain situations when it is not possible. 
For sensitive images, the best approach is to generate an image, share 
it, and then use the step with the dockerImageId, That way the framework 
will not try to fetch it from the docker hub, but it will expect that 
the hosting machine has it. This way of using containers will also be 
preferred over the dockerfile as using a dockerfile would mean that 
the image will be rebuilt at each execution of the workflow.

Back to our example, you can find the *hello.dockerfile* among the 
artifacts. Just build it with ``docker build -f hello.dockerfile -t cwl:hello`` 
command. You can ensure you have the image by running a ``docker images`` 
command once the build finishes.

Passing arguments by name
_________________________ 

Probably the most versatile way for a computational element or command 
to accept arguments is by passing them as named arguments. To show this we 
are going to build a workflow that is going to call our image and pass a 
string and a file arguments by name.



