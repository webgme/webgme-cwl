//This step fetches the given artifact from the PDP storage
define([], function () {
  return function(stepNode, context) {
      const result = [];
      const {core, META, inputs, outputs, nodes} = context;
      const stepCwl = {
          cwlVersion:'v1.1',
          class:'CommandLineTool',
          requirements: {
            InlineJavascriptRequirement:{},
            ShellCommandRequirement: {},
          },
          inputs:{
              ID:'string'
          },
          outputs:{
              output:{
                  type: 'Directory',
                  outputBinding: {
                      glob: ['download/dat/$(inputs.ID.split("_")[1])','download/dat/$(inputs.ID.split("_")[1])/$(inputs.ID.split("_")[2])','download/dat']
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