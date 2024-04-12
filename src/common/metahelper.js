define([], function () {
    class MetaHelper {
        constructor (client, META, id2META) {
            this.nodes = null;
            this.client = client;
            this.META = META;
            this.id2META = id2META;
            this.currentFlow = {};

            this.buildConnectivity();
        }

        buildConnectivity () {
            const {META, client, id2META} = this;
            const clwConcepts = Object.keys(META).filter(name => {return name.indexOf('CWL.') === 0});
            this.connectivity={};
            clwConcepts.forEach(cwlConceptId => {
                const conceptNode = META[cwlConceptId];
                if(conceptNode.isConnection()) {
                    const srcs = conceptNode.getValidTargetIds('src');
                    const dsts = conceptNode.getValidTargetIds('dst');
                    srcs.forEach(src => {
                        const sname = id2META[src];
                        this.connectivity[sname] = this.connectivity[sname] || {};
                        dsts.forEach(dst => {
                            const dname = id2META[dst];
                            this.connectivity[sname][dname] = cwlConceptId;
                        });
                    });
                }

            });
            console.log('CONN:',this.connectivity);
        }

        initialize (workflowId) {
            const {client} = this;
            let currentFlow = {};
            let currentConnections = {};
            const childrenIds = client.getNode(workflowId).getChildrenIds();
            
            currentFlow = {};
            
            childrenIds.forEach(childId => {
                const node = client.getNode(childId);
                if(node.isConnection()) {
                    const src = node.getPointerId('src');
                    const dst = node.getPointerId('dst');

                    currentFlow[src] = currentFlow[src] || {};
                    currentFlow[src][dst] = true;

                    currentConnections[src] = currentConnections[src] || {};
                    currentConnections[src][childId] = true;
                    currentConnections[dst] = currentConnections[dst] || {};
                    currentConnections[dst][childId] = true;
                }
            });

            this.currentFlow = currentFlow;
            this.currentConnections = currentConnections;
        }

        getConnectTypeId (source, target) {
            const {client, META, connectivity, id2META, currentFlow} = this;

            if(currentFlow[source] && currentFlow[source][target]) {
                return null;
            }

            const snode = client.getNode(source);
            const dnode = client.getNode(target);
            let smeta = id2META[snode.getMetaTypeId()];
            let dmeta = id2META[dnode.getMetaTypeId()];
            let result = null;

            console.log('?conn?', smeta, dmeta);

            const smetas = [smeta];
            const dmetas = [dmeta];
            
            while(smeta !== 'CWL.Input' && smeta !== 'CWL.Output') {
                smeta = id2META[META[smeta].getBaseId()];
                smetas.push(smeta);
            }

            while(dmeta !== 'CWL.Input' && dmeta !== 'CWL.Output') {
                dmeta = id2META[META[dmeta].getBaseId()];
                dmetas.push(dmeta);
            }

            smetas.forEach(source => {
                if (connectivity.hasOwnProperty(source)) {
                    dmetas.forEach(target => {
                        if (connectivity[source].hasOwnProperty(target)) {
                            console.log('?conn:',connectivity[source][target]);
                            result = connectivity[source][target];
                        }
                    })
                }
            });
            return result;
        }

        makeConnection(source, target) {

        }

        getRemovals(mainId) {
            const {currentConnections, client, META} = this;
            const result = [mainId];
            if(currentConnections) {
                const node = client.getNode(mainId);
                if(node) {
                    if(currentConnections.hasOwnProperty(mainId)) {
                        Object.keys(currentConnections[mainId]).forEach(id => result.push(id));
                    }
                    node.getChildrenIds().forEach(childId => {
                        const child = client.getNode(childId);
                        if (child && 
                            (child.isInstanceOf(META['CWL.Input'].getId()) ||
                            child.isInstanceOf(META['CWL.Output'].getId()))) {
                                if(currentConnections.hasOwnProperty(childId)) {
                                    Object.keys(currentConnections[childId]).forEach(id => result.push(id));
                                }    
                        }
                    });
                }
            }

            return result;
        }
    }

    return MetaHelper;
});