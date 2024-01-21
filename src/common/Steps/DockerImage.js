//This step executes the given command in the proposed image available locally
define(['./ports'], function (Ports) {
  function getImageName(stepNode, core, nodes, inputs) {
    let name = 'cwlbuilt:';
    inputs.forEach(input => {
      const node = nodes[input];
      if(core.getAttribute(node, 'name') === 'imageId') {
        const edgePath = core.getCollectionPaths(node,'dst')[0] || null;
        if(edgePath) {
          name += core.getAttribute(core.getParent(nodes[core.getPointerPath(nodes[edgePath],'src')]),'name');
        }
      }
    });
    return name;
  }
  
  return function(stepNode, context) {
    const result = [];
    const {core, META, inputs, outputs, nodes, artifacts} = context;
    const stepCwl = {
      cwlVersion:'v1.1',
      class:'CommandLineTool',
      requirements: {
        NetworkAccess: {networkAccess: true},
        InlineJavascriptRequirement:{},
        DockerRequirement: {
          dockerImageId: core.getAttribute(stepNode,'imageId')
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

    //imageId might come from an input string!!!
    if (stepCwl.inputs.hasOwnProperty('imageId')) {
      stepCwl.inputs.imageId = 'string';
      stepCwl.requirements.DockerRequirement.dockerImageId = getImageName(stepNode, core, nodes, inputs);
    }

    outputs.forEach(output => {
      Ports.processOutput(core, META, nodes[output], stepCwl, nodes);
    });

    return stepCwl;
  };
})