define(['ejs','text!./read.me.ejs'], function (ejs, readME) {

    function getReadMeContent (core, META, workflowNode, nodes, defaultInfo) {
        const childrenPaths = core.getChildrenPaths(workflowNode);
        const renderContext = {
            name: core.getAttribute(workflowNode, 'name'), 
            inputs:[], 
            outputs: [],
            defaultInfo, 
            description: core.getAttribute(workflowNode,'documentation')
        };

        childrenPaths.forEach(childPath => {
            if (core.isInstanceOf(nodes[childPath], META['Input'])) {
                renderContext.inputs.push({
                    name: core.getAttribute(nodes[childPath], 'name'), 
                    description: core.getAttribute(nodes[childPath], 'documentation')
                });
            } else if (core.isInstanceOf(nodes[childPath], META['Output'])) {
                renderContext.outputs.push({
                    name: core.getAttribute(nodes[childPath], 'name'), 
                    description: core.getAttribute(nodes[childPath], 'documentation')
                });
            }
        });
        return ejs.render(readME, renderContext);
    }

    return {
        getReadMeContent: getReadMeContent
    }
})