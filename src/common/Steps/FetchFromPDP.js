//This step fetches the given artifact from the PDP storage
define(['text!./fetch_script.step'], function (Script) {
    return function(stepNode, context) {
        const result = [];
        const {core, META, inputs, outputs, nodes, artifacts} = context;
        const stepCwl = {
            cwlVersion:'v1.1',
            class:'CommandLineTool',
            requirements: {
              InlineJavascriptRequirement:{},
              ShellCommandRequirement: {},
              LoadListingRequirement: {
                class: 'LoadListingRequirement',
                loadListing: 'deep_listing'
              }
            },
            inputs:{
                ID:'string'
            },
            outputs:{
                output:{
                    type: 'Directory',
                    outputBinding: {
                      loadListing: 'deep_listing',
                      glob: 'download'
                    }
                }
            },
            arguments:[
              {
                shellQuote:false,
                valueFrom: 'ln -s $LEAP_CLI_DIR/leap_cli.jar\nln -s $LEAP_CLI_DIR/.sample_cache.json\njava -jar leap_cli.jar download -p $(inputs.ID.split("_")[0]) -i $(inputs.ID.split("_")[1]) -d ./download'
              }
            ]
        };
  
        return stepCwl;
    };
  })