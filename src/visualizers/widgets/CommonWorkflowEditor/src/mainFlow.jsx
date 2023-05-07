import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, updateEdge } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

import Fab from '@mui/material/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

//custom nodes
import PortNode from './portnode';
import StepNode from './stepNode';
const nodeTypes = {'port': PortNode, 'step': StepNode}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 150;
const nodeHeight = 30;

const getLayoutedElements = (nodes, edges) => {
  dagreGraph.setGraph({ rankdir: 'LR' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = 'left';
    node.sourcePosition = 'right';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export default function Flow(props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [global, setGlobal] = useState({initialized:false});
  const onUpdateFromControl = useCallback(descriptor => {
    console.log('got update');
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      descriptor.nodes,
      descriptor.edges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    // setGlobal(descriptor.global);
  });
  
  WEBGME_CONTROL.registerUpdate(onUpdateFromControl);

  //const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onConnect = useCallback(params=>{
    console.log(params);
  },[setEdges, setNodes]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        fitView
      >
      <Fab size="small" style={{position:'fixed'}}>
        <FontAwesomeIcon icon={icon({name: 'plus'})}/>
      </Fab>
      </ReactFlow>
    </div>
  );
}
