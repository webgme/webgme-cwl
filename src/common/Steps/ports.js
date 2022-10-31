define([], function() {
    function getMaxPosition (inputs) {
        let max = 1;
        Object.keys(inputs).forEach(key => {
            if (typeof inputs[key] === 'Object') {
                if(inputs[key].position && inputs[key].position > max) {
                    max = inputs[key].position;
                }
            }
        });

        return max;
    }

    function processInput (core, CWLMETA, portNode, cwlStep, artifacts) {
        const location = core.getAttribute(portNode,'location');
        const name = core.getAttribute(portNode,'name');
        const prefix = core.getAttribute(portNode,'prefix');
        const asArgument = core.getAttribute(portNode,'asArgument');
        const value = '' + core.getAttribute(portNode,'value');
        const inputs = cwlStep.inputs;
        const hasSource = core.getCollectionPaths(portNode,'dst').length > 0;
        const staging = cwlStep.requirements.InitialWorkDirRequirement.listing;

        if (asArgument) {
            //Inputs used as arguments
            const maxPosition = getMaxPosition(inputs);
            if (core.isInstanceOf(portNode,CWLMETA['FileInput'])) {
                inputs[name] = {type:'File',inputBinding:{position: maxPosition+1, prefix:prefix}};
                if (!hasSource && value) {
                    /*inputs[name].type = 'File?';
                    staging.push({
                        writeable:true,
                        entryname: location,
                        entry: value
                    });*/
                    artifacts.push({input:name, name:location, content:value});
                }
            } else if (core.isInstanceOf(portNode,CWLMETA['StringInput'])) {
                inputs[name] = {type:'String',inputBinding:{position: maxPosition+1, prefix:prefix}, default: value};
            } else if (core.isInstanceOf(portNode,CWLMETA['DirectoryInput'])) {
                inputs[name] = {type:'Directory',position: maxPosition+1, prefix:prefix};
            } else {
                throw new Error('missing processing for this input type!!!');
            }
        } else {
            //Inputs needs to be in the working directory
            if (core.isInstanceOf(portNode,CWLMETA['FileInput'])) {
                if(hasSource) {
                    inputs[name] = 'File';
                    if (location) {
                        cwlStep.arguments[0].valueFrom = 
                            'ln -s $(inputs.' + name + '.path) ' + 
                            location +'\n' + cwlStep.arguments[0].valueFrom;
                    }
                    staging.push({
                        entry: '$(inputs.' + name + ')',
                        writable: true
                    });
                } else if (value) {
                    inputs[name] = 'File';
                    /*staging.push({
                        writeable:true,
                        entryname: location,
                        entry: value
                    });*/
                    artifacts.push({input:name, name:location, content:value});
                } else {
                    inputs[name] = 'File';
                }
            } else if (core.isInstanceOf(portNode,CWLMETA['StringInput'])) {
                inputs[name] = {type:'String', default: value};
            } else if (core.isInstanceOf(portNode,CWLMETA['DirectoryInput'])) {
                inputs[name] = 'Directory';
                if (location) {
                    cwlStep.arguments[0].valueFrom = 
                        'ln -s $(inputs.' + name + '.path) ' + 
                        location + '\n' + cwlStep.arguments[0].valueFrom;
                }
                staging.push({
                    entry: '$(inputs.' + name + ')',
                    writable: true
                });
            } else {
                throw new Error('missing processing for this input type!!!');
            }
        }
    }

    function processOutput (core, CWLMETA, portNode, cwlStep) {
        const outputs = cwlStep.outputs;
        const pattern = core.getAttribute(portNode,'pattern');
        const name = core.getAttribute(portNode,'name');
        const value = core.getAttribute(portNode,'value');
        
        if (core.isInstanceOf(portNode,CWLMETA['FileOutput'])) {
            outputs[name] = {type:'File',outputBinding:{glob: pattern}};
        } else if (core.isInstanceOf(portNode,CWLMETA['DirectoryOutput'])) {
            outputs[name] = {type:'Directory',outputBinding:{glob: pattern}};
        } else {
            throw new Error('missing processing for this input type!!!');
        }
    }

    return {
        processInput: processInput,
        processOutput: processOutput
    }
})