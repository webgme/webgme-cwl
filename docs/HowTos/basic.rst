How to create CWL models - the basics
==============================================


The goal
________

The following how-to documentation is aimed to describe the basic steps
of creating and using a CWL model in the design studio. It is going to assume
that the user has a basic understanding of the WebGME concepts - check either the 
`wiki pages <https://github.com/webgme/webgme/wiki>`_ or the
`youtube videos <https://www.youtube.com/@webgme6963/videos>`_ (with special attention
to the `basics of modeling <https://www.youtube.com/watch?v=YKi_256Vy_0>`_ example).

Create workflow model
______________________________

As we have described in the :ref: `The Common Workflow Language modeling language` section
there are essentially only a few building blocks when you manipulate a workflow. However,
to aim for absolute clarity and guide our users in the process (who might not be experienced
in WebGME based Design Studio usage), here we provide a start to finish description
of workflow model creation.

At first, the user is welcomed with a create project dialog, where we suggest to pick
the default 'cwl_base' seed as a starting point of the work and pick a unique name for the
project. While each project in the CWL Design Studio can hold multiple workflows (and we
will describe how to export and import workflows into a project), for the sake of simplicity
we will stick to the one project one workflow rule.

.. figure:: agif_cwl_basics_000.gif
   :align: center
   :figwidth: 95%
   
   Creating an empty workflow project in the Design Studio

Once the project is created, we are welcomed with an empty *Workflows* folder where our 
initial action must be the creation of a Workflow that can be done with a simple drag and
drop operation using the *Part Bworser* (bottom left sidebar section with the list of 
available elements and their visual depiction). This drag and drop operation will be used
for all further element creation so we are not going to described them in detail but 
expect the user to follow this one with the apropriate element.

.. figure:: agif_cwl_basics_001.gif
   :align: center
   :figwidth: 75%
   
   Components of the Workflow or the workflow itself can be created by
   drag-and-drop from the *Part Browser*

With our new workflow, the first steps should be to name it and to enter into this 
new context so that we can create the parts of the workflow.

--- gif of naming and entering (using icon on selection) ---


Adding and editing components
______________________________

When you add your components which falls into the category of either input, 
output, or step/ sub-workflow, you just follow the drag and drop method using
the *Part Browser*. Once your component is on the screen the main editing and
configuration happens on the bottom right sidebar of the screen called the
*Property Editor*.
