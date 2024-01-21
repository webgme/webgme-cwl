//This step executes the given command in the proposed image described by the dockerfile
define(['./ports'], function (Ports) {
  return function(stepNode, context) {
      const result = [];
      const {core, META, inputs, outputs, nodes, artifatcs} = context;
      const stepCwl = {
          cwlVersion:'v1.1',
          class:'CommandLineTool',
          requirements: {
              NetworkAccess: {networkAccess: true},
              InlineJavascriptRequirement:{},
              DockerRequirement: {
                dockerFile: core.getAttribute(stepNode,'dockerfile')
              },
              ShellCommandRequirement: {},
              InitialWorkDirRequirement: {
                listing: []
              }
            },
          inputs:{},
          outputs:{},
          arguments:[
            {
              shellQuote:false,
              valueFrom: core.getAttribute(stepNode,'command') || ''
            }
          ]
      };

      if(core.getAttribute(stepNode,'workdir')) {
        stepCwl.arguments[0].valueFrom = 'ln -s ' + core.getAttribute(stepNode,'workdir') + '/* ./\n' + stepCwl.arguments[0].valueFrom;
      }

      inputs.forEach(input => {
        Ports.processInput(core, META, nodes[input], stepCwl, artifacts);
      });

      outputs.forEach(output => {
        Ports.processOutput(core, META, nodes[output], stepCwl, nodes);
      });

      return stepCwl;
  };
})