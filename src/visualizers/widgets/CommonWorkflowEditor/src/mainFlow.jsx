import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, updateEdge } from 'reactflow';
import 'reactflow/dist/style.css';

import Fab from '@mui/material/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

//custom nodes
import PortNode from './portnode';
import StepNode from './stepNode';
const nodeTypes = {'port': PortNode, 'step': StepNode}


export default function Flow(props) {
  console.log('newprops?', props);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  const [global, setGlobal] = useState({initialized:false});
  const onUpdateFromControl = useCallback(descriptor => {
    console.log('got update');
    setNodes(descriptor.nodes);
    setEdges(descriptor.edges);
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
