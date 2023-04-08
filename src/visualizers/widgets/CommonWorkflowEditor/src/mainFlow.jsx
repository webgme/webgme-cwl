import React, { useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

import Fab from '@mui/material/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

//custom nodes
import PortNode from './portnode';
const nodeTypes = {'port': PortNode}

const initialNodes = [
  { id: '1', type: 'port', position: { x: 100, y: 100 }},
  { id: '2', position: { x: 200, y: 200 }, data: { label: '2' } },
];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
const initialEdges = [];

export default function Flow(props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
      <Fab size="small" style={{position:'fixed'}}>
        <FontAwesomeIcon icon={icon({name: 'plus'})}/>
      </Fab>
      </ReactFlow>
    </div>
  );
}
