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
        const position = core.getAttribute(portNode, 'position')
        let value = '' + core.getAttribute(portNode,'value');
        const inputs = cwlStep.inputs;
        const hasSource = core.getCollectionPaths(portNode,'dst').length > 0;
        const staging = cwlStep.requirements.InitialWorkDirRequirement ? cwlStep.requirements.InitialWorkDirRequirement.listing || [] : [];

        //TODO: by default we change all inputs to in/out values therefore, we are going to stage all inputs with writable
        if (asArgument) {
            if (position === -1) {
                //Inputs used as arguments
                const maxPosition = getMaxPosition(inputs);
                if (core.isInstanceOf(portNode,CWLMETA['FileInput'])) {
                    inputs[name] = {type:'File',inputBinding:{position: maxPosition + 1, prefix:prefix + name}};
                    if (!hasSource && value) {
                        //artifacts.push({input:name, name:location, content:value});
                        inputs[name].default =
                        {
                            class:'File',
                            basename:location || name+'.txt',
                            contents: value
                        };
                    }
                    staging.push({entry:'$(inputs[\'' + name + '\'])', writable: true});
                } else if (core.isInstanceOf(portNode,CWLMETA['FileArrayInput'])) {
                    inputs[name] = {type:'File[]',inputBinding:{position: maxPosition + 1, prefix:prefix + name}};
                } else if (core.isInstanceOf(portNode,CWLMETA['StringInput'])) {
                    inputs[name] = {type:'string' + (value ? '?' : ''),inputBinding:{position: maxPosition + 1, prefix:prefix + name}, default: value};
                } else if (core.isInstanceOf(portNode,CWLMETA['StringArrayInput'])) {
                    try {
                        value = JSON.parse(value || []);
                    } catch (e) {
                        //TODO: should we add something here???
                        value = null;
                    }
                    inputs[name] = {type:'string[]' + (value ? '?' : ''),inputBinding:{position: maxPosition + 1, prefix:prefix + name}, default: value};
                } else if (core.isInstanceOf(portNode,CWLMETA['DirectoryInput'])) {
                    inputs[name] = {type:'Directory',inputBinding:{position: maxPosition + 1, prefix:prefix + name}};
                    staging.push({entry:'$(inputs[\'' + name + '\'])', writable: true});
                    if (!hasSource && value && location.indexOf('./') === 0) {
                        artifacts.push({input:name, name:location.slice(2), isDefaultDirectory: true});
                    }
                } else if (core.isInstanceOf(portNode,CWLMETA['DirectoryArrayInput'])) {
                    inputs[name] = {type:'Directory[]',inputBinding:{position: maxPosition + 1, prefix:prefix + name}};
                    staging.push({entry:'$(inputs[\'' + name + '\'])', writable: true});
                } else {
                    throw new Error('missing processing for this input type!!!');
                }
            } else {
                if (core.isInstanceOf(portNode,CWLMETA['FileInput'])) {
                    inputs[name] = {type:'File',inputBinding:{position: position}};
                    if (!hasSource && value) {
                        //artifacts.push({input:name, name:location, content:value});
                        inputs[name].default =
                        {
                            class:'File',
                            basename:location || name+'.txt',
                            contents: value
                        };
                    }
                    staging.push({entry:'$(inputs[\'' + name + '\'])', writable: true});
                } else if (core.isInstanceOf(portNode,CWLMETA['FileArrayInput'])) {
                    inputs[name] = {type:'File[]',inputBinding:{position: position}};
                } else if (core.isInstanceOf(portNode,CWLMETA['StringInput'])) {
                    inputs[name] = {type:'string' + (value ? '?' : ''),inputBinding:{position: position}, default: value};
                } else if (core.isInstanceOf(portNode,CWLMETA['StringArrayInput'])) {
                    try {
                        value = JSON.parse(value || []);
                    } catch (e) {
                        //TODO: should we add something here???
                        value = null;
                    }
                    inputs[name] = {type:'string[]' + (value ? '?' : ''),inputBinding:{position: position}, default: value};
                } else if (core.isInstanceOf(portNode,CWLMETA['DirectoryInput'])) {
                    inputs[name] = {type:'Directory',inputBinding:{position: position}};
                    staging.push({entry:'$(inputs[\'' + name + '\'])', writable: true});
                    if (!hasSource && value && location.indexOf('./') === 0) {
                        artifacts.push({input:name, name:location.slice(2), isDefaultDirectory: true});
                    }
                } else if (core.isInstanceOf(portNode,CWLMETA['DirectoryArrayInput'])) {
                    inputs[name] = {type:'Directory',inputBinding:{position: position}};
                    staging.push({entry:'$(inputs[\'' + name + '\'])', writable: true});
                } else {
                    throw new Error('missing processing for this input type!!!');
                }
            }
        } else {
            //Inputs needs to be in the working directory
            if (core.isInstanceOf(portNode, CWLMETA['FileInput'])) {
                inputs[name] = 'File';
                if(hasSource) {
                    if (location) {
                        cwlStep.arguments[0].valueFrom = 
                            'ln -s $(inputs[\'' + name + '\'].path) ' + 
                            location +'\n' + cwlStep.arguments[0].valueFrom;
                    }
                    staging.push({
                        entry: '$(inputs[\'' + name + '\'])',
                        writable: true
                    });
                } else if (value) {
                    /*staging.push({
                        writeable:true,
                        entryname: location,
                        entry: value
                    });*/
                    /*artifacts.push({input:name, name:location, content:value});*/
                    inputs[name] = {
                        type:'File?',
                        default:{
                            class:'File',
                            basename:location || name+'.txt',
                            contents: value
                        }
                    };
                } 
            } else if (core.isInstanceOf(portNode, CWLMETA['FileArrayInput'])) {
                inputs[name] = 'File[]';
            } else if (core.isInstanceOf(portNode,CWLMETA['StringInput'])) {
                inputs[name] = {type:'string' + (value ? '?' : ''), default: value};
            } else if (core.isInstanceOf(portNode,CWLMETA['StringArrayInput'])) {
                try {
                    value = JSON.parse(value || []);
                } catch (e) {
                    //TODO: should we add something here???
                    value = null;
                }
                inputs[name] = {type:'string[]' + (value ? '?' : ''), default: value};
            } else if (core.isInstanceOf(portNode,CWLMETA['DirectoryInput'])) {
                inputs[name] = 'Directory';
                if (location) {
                    cwlStep.arguments[0].valueFrom = 
                        'ln -s $(inputs[\'' + name + '\'].path) ' + 
                        location + '\n' + cwlStep.arguments[0].valueFrom;
                }
                staging.push({
                    entry: '$(inputs[\'' + name + '\'])',
                    writable: true
                });
                if (!hasSource && value && location.indexOf('./') === 0) {
                    artifacts.push({input:name, name:location.slice(2), isDefaultDirectory: true});
                }
            } else if (core.isInstanceOf(portNode,CWLMETA['DirectoryArrayInput'])) {
                inputs[name] = 'Directory[]';
                staging.push({
                    entry: '$(inputs[\'' + name + '\'])',
                    writable: true
                });
            } else {
                throw new Error('missing processing for this input type!!!');
            }
        }
    }

    function processOutput (core, CWLMETA, portNode, cwlStep, nodes) {
        const outputs = cwlStep.outputs;
        const pattern = core.getAttribute(portNode,'pattern');
        const name = core.getAttribute(portNode,'name');
        const value = core.getAttribute(portNode,'value');
        
        if (core.isInstanceOf(portNode,CWLMETA['FileOutput'])) {
            outputs[name] = {type:'File',outputBinding:{glob: pattern}};
        } else if (core.isInstanceOf(portNode,CWLMETA['FileArrayOutput'])) {
            outputs[name] = {type:'File[]',outputBinding:{glob: pattern}};
        } else if (core.isInstanceOf(portNode,CWLMETA['DirectoryOutput'])) {
            outputs[name] = {type:'Directory',outputBinding:{glob: pattern}};
        } else if (core.isInstanceOf(portNode,CWLMETA['DirectoryArrayOutput'])) {
            outputs[name] = {type:'Directory[]',outputBinding:{glob: pattern}};
        } else {
            throw new Error('missing processing for this input type!!!');
        }
        
        //TODO we always need to check if the source is correct or not and if this
        //  part needs updating
        if(core.getPointerPath(portNode,'source') && nodes[core.getPointerPath(portNode,'source')]) {
            const sname = core.getAttribute(nodes[core.getPointerPath(portNode,'source')], 'name');
            outputs[name].outputBinding.glob = '$(inputs[\'' + sname +'\'].path)';
        }
    }

    function getValueFromInputOrAttribute (propertyName, node, context) {
        const {inputs, core, nodes} = context; 
        let result = core.getAttribute(node, propertyName);
        inputs.forEach(input => {
            const port = nodes[input];
            if(core.getAttribute(port, 'name') === propertyName) {
              const edgePath = core.getCollectionPaths(port,'dst')[0] || null;
              if(edgePath) {
                result = core.getAttribute(core.getParent(nodes[core.getPointerPath(nodes[edgePath],'src')]),'name');
              }
            }
        });
        return result;

    }

    return {
        processInput: processInput,
        processOutput: processOutput,
        getValueFromInputOrAttribute: getValueFromInputOrAttribute
    }
})