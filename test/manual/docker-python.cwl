#!/usr/bin/env cwl-runner

cwlVersion: v1.0
class: CommandLineTool
baseCommand: python
hints:
  DockerRequirement:
    dockerPull: python
inputs:
  src:
    type: File
    inputBinding:
        position: 1
  text:
    type: string
    inputBinding:
      position: 2
outputs:
  file_out:
    type: File
    outputBinding:
        glob: output-python.txt