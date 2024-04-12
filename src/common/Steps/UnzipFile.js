//This step executes the given command in the proposed image described by the dockerfile
define([], function () {
    return function(stepNode, context) {
        const result = [];
        const {core, META, inputs, outputs, nodes, artifacts} = context;
        const stepCwl = {
            cwlVersion:'v1.1',
            class:'CommandLineTool',
            requirements: {
                InlineJavascriptRequirement:{},
                DockerRequirement: {
                    dockerPull: 'alpine:3.17.2'
                },
                ShellCommandRequirement: {},
                InitialWorkDirRequirement: {
                  listing: []
                }
              },
            inputs:{
                zip: 'File'
            },
            outputs:{
                output: {
                    type: 'Directory',
                    outputBinding: {
                      glob: './output'
                    }
                  }
            },
            arguments:[
              {
                shellQuote:false,
                valueFrom: 'mkdir output\nunzip $(inputs.zip.path) -d output'
              }
            ]
        };

        return stepCwl;
    };
})