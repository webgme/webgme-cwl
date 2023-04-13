Define the granurality of your compute artifact
_________________________________________________
When it comes to wrapping your computational artifact into a 
workflow, you need to define what is going to be the granularity 
of it. By granularity, we mean the task of each step or 
sub-workflow in the workflow (one end of the spectrum is the 
singular compute workflow step). While each use-case is unique 
we can provide a few things to take into consideration:
* Identify whether there are any intermediate file states 
  as those could provide natural cuts on ytour computation.
* Another aspect is the re-use of any atomic element. You 
  do not need to separate worklow/step just for the sake of it. 
  You need to create computational steps that do meaningful work 
  and potentially can be leveraged in other workflows.