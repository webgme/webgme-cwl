//This step extracts the identified file from a directory
define(['./ports'], function (Ports) {
    return function(stepNode, context) {
        const result = [];
        const {core, META, inputs, outputs, nodes} = context;
        const stepCwl = {
            cwlVersion:'v1.1',
            class:'CommandLineTool',
            baseCommand:'echo',
            requirements: {
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
                        glob: core.getAttribute(stepNode, 'fileName')
                    }
                }
            }
        };
  
        return stepCwl;
    };
  })