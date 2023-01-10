Getting Started
===============


How to use this documentation?
______________________________

This documentation is intended for both users and developers of the WebGME-CWL design studio.
A design studio that aimed to help in building workflow models that can be translated into 
common workflow language workflow descriptions with all necessary artifacts.

While certain sections are clear whether aimed for users or developers, but to make it 
absolutely unequivocal, each will contain a small hint right at the beginning.

For users we intend to provide how-to's and functions descriptions as well as 
providing a little theoretical background when it comes to the underlying workflow 
language.

For developers, we will show where we intend to offer extension points so that they 
might further specializes the end-user experience.


Further reading?
________________

There are a few key elements of the design studio, that are used technologies and 
these pages are not aimed to desribe those in details, so we are just referring to 
descriptions of those and mention in what way our desing studio is leveraging them:

- `Common Workflow Language <https://www.commonwl.org/>`_ is the workflow description 
  language that our design studio uses underneath. This means a user can generate CWL 
  artifacts from the visual models and be able to execute them in a properly set 
  execution environment (a basic environment setup guide is available in the howto section).
- `WebGME <https://webgme.org/>`_ is the web-based modeling environment that provides 
  the core framework for our design studio. It allows a metaprogrammable environment 
  and offers features like a centralized project registry, user authentication, 
  online colaboration, or version management. Its main goal is to allow the rapid 
  development of domain specific modeling environments that are primarily visual in nature.
- `Taxonomy Design Studio <https://webgme-taxonomy.readthedocs.io/en/latest/#>`_ is another 
  design studio that deals with building taxonomies for tagging and classification of 
  various artifacts. Our design studio heavily relies on such taxonomies when it offers 
  cloud based data access or tagging of the users workflows.

