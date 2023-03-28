define(['./ports'], function (Ports) {
    return function(stepNode, context) {
        const result = [];
        const {core, META, inputs, nodes} = context;
        const stepCwl = {
            cwlVersion:'v1.1',
            class:'CommandLineTool',
            requirements: {
                InlineJavascriptRequirement:{},
                ShellCommandRequirement: {},
                InitialWorkDirRequirement: {
                  listing: []
                }
              },
            inputs:{
                nametag:'string',
                dir: 'Directory'
            },
            outputs:{
                id: '$(inputs.nametag)'
            },
            arguments:[
              {
                shellQuote:false,
                valueFrom: 'docker build -t $(inputs.nametag) $(inputs.dir.path)'
              }
            ]
        };
  
        if(core.getAttribute(stepNode,'workdir')) {
          stepCwl.arguments[0].valueFrom = 'ln -s ' + core.getAttribute(stepNode,'workdir') + '/* ./\n' + stepCwl.arguments[0].valueFrom;
        }
  
        inputs.forEach(input => {
            if( core.getAttribute(nodes[input], 'name') === 'nametag') {
                Ports.processInput(core, META, nodes[input], stepCwl);
            }
        });

        return stepCwl;
    };
  })