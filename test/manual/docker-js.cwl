#!/usr/bin/env cwl-runner

cwlVersion: v1.0
class: CommandLineTool
baseCommand: node
hints:
  DockerRequirement:
    dockerPull: node:slim
inputs:
  src:
    type: File
    inputBinding: 
        position: 1

  text:
    type: File
    inputBinding:
      position: 2
outputs:
  st_out:
    type: stdout

stdout: output.txt