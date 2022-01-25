define([], function () {
    class graph {
        constructor (core, nodes, META) {
            this.nodes = nodes; // dictionary where the key is the path of the node
            this.core = core;
            this.META = META;
            this.vertices = [];
            this.outNeighbors = [];
            this.inNeighbors = [];
            this.edges = [];
            this._isDAG = null;

            let paths = Object.keys(nodes);
            let guids = [];
            let g2p = {};

            paths.forEach(path => {
                const node = nodes[path];
                const guid = core.getGUID(node);
                if (core.isInstanceOf(node, META['Flow'])) {
                    this.edges.push(path);
                } else if (core.isInstanceOf(node, META['Step'])) {
                    // this.vertices.push(path);
                    g2p[guid] = path;
                    guids.push(guid);
                    this.inNeighbors.push([]);
                    this.outNeighbors.push([]);
                }
            });

            guids.sort();
            for(let i=0; i<guids.length; i+=1) {
                this.vertices.push(g2p[guids[i]]);
            }

            this.edges.forEach(edgePath => {
                const edge = nodes[edgePath];
                const srcPath = core.getPath(core.getParent(nodes[core.getPointerPath(edge, 'src')]));
                const dstPath = core.getPath(core.getParent(nodes[core.getPointerPath(edge, 'dst')]));
                const srcIndex = this.vertices.indexOf(srcPath);
                const dstIndex = this.vertices.indexOf(dstPath);
                this.outNeighbors[srcIndex].push(dstIndex);
                this.inNeighbors[dstIndex].push(srcIndex);
            });
        }

        reachableVertices (startPath) {
            const reachables = [];
            const taskList = [startPath];

            const nextStep = () => {
                const currentIndex = this.vertices.indexOf(taskList.shift());
                this.outNeighbors[currentIndex].forEach(outIndex => {
                    if (reachables.indexOf(this.vertices[outIndex]) === -1) {
                        reachables.push(this.vertices[outIndex]);
                        taskList.push(this.vertices[outIndex]);
                    }
                });
            };

            while(taskList.length > 0) {
                nextStep();
            }

            return reachables;
        }

        isDAG () {
            if (this._isDAG !== null) {
                return this._isDAG;
            }

            let loopFound = false;
            let currentIndex = 0;

            while (loopFound === false && currentIndex < this.vertices.length) {
                const currentPath = this.vertices[currentIndex];
                const reachables = this.reachableVertices(currentPath);
                if(reachables.indexOf(currentPath) !== -1) {
                    loopFound = true;
                }
                currentIndex++;
            }

            this._isDAG = loopFound;
            return !loopFound;
        }

        getStepOrder () {
            const orderedStepPaths = [];
            const stillToOrder = {};
            const ins = JSON.parse(JSON.stringify(this.inNeighbors));
            const outs = JSON.parse(JSON.stringify(this.outNeighbors));

            this.vertices.forEach((path,index) => {
                stillToOrder[path] = index;
            });
            const removeVertex = (vertexIndex) => {
                outs[vertexIndex].forEach(toClean => {
                    ins[toClean].splice(ins[toClean].indexOf(vertexIndex), 1);
                });
            };

            while (Object.keys(stillToOrder).length > 0) {
                const canBeRemoved = [];
                const keys = Object.keys(stillToOrder);
                keys.forEach(path => {
                    const index = stillToOrder[path];
                    if (ins[index].length === 0) {
                        canBeRemoved.push(index);
                        orderedStepPaths.push(this.vertices[index]);
                        delete stillToOrder[path];
                    }
                });

                canBeRemoved.forEach(index => {
                    removeVertex(index);
                });
            }

            return orderedStepPaths;
        }
    }

    return graph;
});