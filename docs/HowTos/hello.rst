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

Docerize your script 
______________________ 


