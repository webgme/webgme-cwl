define(['webgme-json/jsonFunctions',], function (JSONFunctions) {

    class StepHelper {
        constructor (core, META, nodes, logger) {
            this.core = core;
            this.META = META;
            this.nodes = nodes;
            this.logger = logger;
            const JSON_META = {};
            Object.keys(META).forEach(metaName => {
                if(metaName.indexOf('JSON.') === 0) {
                    JSON_META[metaName.substr(5)] = META[metaName];
                }
            });
            this.jMeta = JSON_META;
        }

        getNodeConfig (node) {
            let config = null;
            this.core.getChildrenPaths(node).forEach(childPath => {
                if (this.core.getAttribute(this.nodes[childPath], 'name') === 'config') {
                    try {
                        config = JSON.parse(JSONFunctions.JSONHierarchyToString(this.nodes, this.nodes[childPath], this.core, this.jMeta, this.logger));
                    } catch (e) {
                        this.logger.error(e);
                    }
                } else {
                    this.logger.error('Missing config node');
                }
            });
            if (config) {
                return config;
            } else {
                this.logger.error('Unable to gather configuration of the node!');
                return {};
            }
        }

        getOutNodeConfig (node) {
            this.core.getChildrenPaths(node).forEach(childPath => {
                if (this.core.getAttribute(this.nodes[childPath], 'name') === 'out') {
                    try {
                        return this.getNodeConfig(this.nodes[childPath]);
                    } catch (e) {
                        this.logger.error(e);
                        return {};
                    }
                }
            });
        }
    }
    return StepHelper;
});