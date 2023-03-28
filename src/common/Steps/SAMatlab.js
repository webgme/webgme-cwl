//This step executes the given command in the proposed image described by the dockerfile
define(['./ports','text!./mlab_dockerfile.ejs', 'ejs', 'text!./mlab_func_scripts.step'], function (Ports, Dockerfile, ejs, functions) {
    const sources = {
        R2023a: 'https://ssd.mathworks.com/supportfiles/downloads/R2023a/Release/0/deployment_files/installer/complete/glnxa64/MATLAB_Runtime_R2023a_glnxa64.zip',
        R2022b: 'https://ssd.mathworks.com/supportfiles/downloads/R2022b/Release/5/deployment_files/installer/complete/glnxa64/MATLAB_Runtime_R2022b_Update_5_glnxa64.zip',
        R2022a: 'https://ssd.mathworks.com/supportfiles/downloads/R2022a/Release/6/deployment_files/installer/complete/glnxa64/MATLAB_Runtime_R2022a_Update_6_glnxa64.zip',
        R2021b: 'https://ssd.mathworks.com/supportfiles/downloads/R2021b/Release/5/deployment_files/installer/complete/glnxa64/MATLAB_Runtime_R2021b_Update_5_glnxa64.zip',
        R2021a: 'https://ssd.mathworks.com/supportfiles/downloads/R2021a/Release/8/deployment_files/installer/complete/glnxa64/MATLAB_Runtime_R2021a_Update_8_glnxa64.zip',
        R2020b: 'https://ssd.mathworks.com/supportfiles/downloads/R2020b/Release/8/deployment_files/installer/complete/glnxa64/MATLAB_Runtime_R2020b_Update_8_glnxa64.zip',
        R2020a: 'https://ssd.mathworks.com/supportfiles/downloads/R2020a/Release/8/deployment_files/installer/complete/glnxa64/MATLAB_Runtime_R2020a_Update_8_glnxa64.zip',
        R2019b: 'https://ssd.mathworks.com/supportfiles/downloads/R2019b/Release/9/deployment_files/installer/complete/glnxa64/MATLAB_Runtime_R2019b_Update_9_glnxa64.zip',
        R2019a: 'https://ssd.mathworks.com/supportfiles/downloads/R2019a/Release/9/deployment_files/installer/complete/glnxa64/MATLAB_Runtime_R2019a_Update_9_glnxa64.zip',
        R2018b: 'https://ssd.mathworks.com/supportfiles/downloads/R2018b/deployment_files/R2018b/installers/glnxa64/MCR_R2018b_glnxa64_installer.zip',
        R2018a: 'https://ssd.mathworks.com/supportfiles/downloads/R2018a/deployment_files/R2018a/installers/glnxa64/MCR_R2018a_glnxa64_installer.zip',
        R2017b: 'https://ssd.mathworks.com/supportfiles/downloads/R2017b/deployment_files/R2017b/installers/glnxa64/MCR_R2017b_glnxa64_installer.zip'
    };
    const files = {
        R2023a: 'MATLAB_Runtime_R2023a_glnxa64.zip',
        R2022b: 'MATLAB_Runtime_R2022b_Update_5_glnxa64.zip',
        R2022a: 'MATLAB_Runtime_R2022a_Update_6_glnxa64.zip',
        R2021b: 'MATLAB_Runtime_R2021b_Update_5_glnxa64.zip',
        R2021a: 'MATLAB_Runtime_R2021a_Update_8_glnxa64.zip',
        R2020b: 'MATLAB_Runtime_R2020b_Update_8_glnxa64.zip',
        R2020a: 'MATLAB_Runtime_R2020a_Update_8_glnxa64.zip',
        R2019b: 'MATLAB_Runtime_R2019b_Update_9_glnxa64.zip',
        R2019a: 'MATLAB_Runtime_R2019a_Update_9_glnxa64.zip',
        R2018b: 'MCR_R2018b_glnxa64_installer.zip',
        R2018a: 'MCR_R2018a_glnxa64_installer.zip',
        R2017b: 'MCR_R2017b_glnxa64_installer.zip'
    };
    const basepath = '/usr/local/MATLAB/MATLAB_Runtime/'

    return function(stepNode, context) {
        const result = [];
        const {core, META, inputs, outputs, nodes} = context;
        const mlabversion = core.getAttribute(stepNode,'version');
        const dockerfile = ejs.render(Dockerfile,{mlab:sources[mlabversion], mfile:files[mlabversion], mversion:mlabversion});
        const stepCwl = {
            cwlVersion:'v1.1',
            class:'CommandLineTool',
            requirements: {
                InlineJavascriptRequirement:{
                    expressionLib:[
                        functions
                    ]
                },
                DockerRequirement: {
                  dockerImageId: 'matlab:' + mlabversion,
                  dockerFile: dockerfile
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
                valueFrom: 'chmod 777 $(inputs.app.path + "/" + getMlabInfo(inputs.app.listing).file)\nchmod 777 $(inputs.app.path + "/" + getMlabInfo(inputs.app.listing).script)\n$(inputs.app.path + "/" + getMlabInfo(inputs.app.listing).script) ' + basepath + mlabversion
              }
            ]
        };
  
        inputs.forEach(input => {
          Ports.processInput(core, META, nodes[input], stepCwl);
        });
  
        outputs.forEach(output => {
          Ports.processOutput(core, META, nodes[output], stepCwl, nodes);
        });
  
        stepCwl.inputs.app =  {
          type: 'Directory',
          loadListing: 'deep_listing'
        };

        return stepCwl;
    };
  })