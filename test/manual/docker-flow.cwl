#!/usr/bin/env cwl-runner

cwlVersion: v1.0
class: Workflow
inputs:
  additional_line: 
    type: string
    default: "fixed string"
  something:
    type: File
    streamable: true
    location: ./test1.py

outputs:
  js_output:
    type: File
    outputSource: js/st_out

steps:
  python:
    run: docker-python.cwl
    in:
      text: additional_line
    out: [file_out]

  js:
    run: docker-js.cwl
    in:
      text: python/file_out
    out: [st_out]