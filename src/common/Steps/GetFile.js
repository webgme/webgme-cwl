//This step extracts the identified file from a directory
define(['./ports','text!./getfile_script.step.ejs','ejs'], function (Ports, ScriptTemplate, ejs) {
    return function(stepNode, context) {
        const result = [];
        const {core, META, inputs, outputs, nodes, artifacts} = context;
        const Script = ejs.render(ScriptTemplate,{isArray: false, pattern: core.getAttribute(stepNode,'fileName')});
        const stepCwl = {
            cwlVersion:'v1.1',
            class:'CommandLineTool',
            baseCommand:'echo',
            requirements: {
                InlineJavascriptRequirement:{},
                LoadListingRequirement: {
                    class: 'LoadListingRequirement',
                    loadListing:'deep_listing'
                  },
                  InitialWorkDirRequirement: {
                    listing: '$(inputs.input.listing)'  
                  }
            },
            inputs:{
                input:'Directory'
            },
            outputs:{
                output:{
                    type: 'File',
                    outputBinding: {
                        loadListing: 'deep_listing',
                        glob: '*',
                        outputEval: '${' + Script + '}'
                    }
                }
            }
        };
  
        return stepCwl;
    };
  })