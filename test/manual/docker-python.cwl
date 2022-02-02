#!/usr/bin/env cwl-runner

cwlVersion: v1.0
class: CommandLineTool
baseCommand: [python, test1.py]
hints:
  DockerRequirement:
    dockerPull: python
requirements:
  InitialWorkDirRequirement:
    listing:
      - ./test1.py
inputs:
  text:
    type: string
    inputBinding:
      position: 2
outputs:
  file_out:
    type: File
    outputBinding:
        glob: output-python.txt