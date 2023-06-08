import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, updateEdge, Controls } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import Grid from '@mui/material/Grid';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

//custom nodes
import PortNode from './portnode';
import StepNode from './stepNode';
import WorkflowNode from './workflowNode';
const nodeTypes = {port: PortNode, step: StepNode, workflow: WorkflowNode};


//config wizardry
import ConfigWizard from '../../../../common/react/configWizard';
import newElementBaseData from '../../../../common/wizards/NewElemementData.json';

const finishNewElementBaseData = (wfnames2ids) => {
  newElementBaseData.allOf[0].then.properties.prototype.enum = ['- empty -'];
  Object.keys(wfnames2ids).forEach(wfname => {
    newElementBaseData.allOf[0].then.properties.prototype.enum.push(wfname);
  });
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 80;
const nodeHeight = 30;

const getLayoutedElements = (nodes, edges) => {
  dagreGraph.setGraph({ rankdir: 'LR', nodesep:20, ranksep:20});
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

/**
 * 
 * Operational states:
 * -standard: editing and such
 * -modal: pop-up configwizard is on
 */

export default function Flow(props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [global, setGlobal, onGlobalChange] = useState({});
  const [menu, setMenu, onMenuChange] = useState(false);

  const [operation, setOperation] = useState('standard');
  const onUpdateFromControl = useCallback(descriptor => {
    console.log('update from control', descriptor);
    finishNewElementBaseData(descriptor.global.wfnames2ids);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      descriptor.nodes,
      descriptor.edges
    );
    layoutedEdges.forEach(edge => {
      edge.markerEnd = {type:'arrowclosed'};
      edge.interactionWidth = 2;
      edge.style = {color:'black'};
    });
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setGlobal(descriptor.global);
  });
  
  WEBGME_CONTROL.registerUpdate(onUpdateFromControl);

  //const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onConnect = params => {
    const {source, target} = getSourceAndTarget(params);
    const type = global.getConnectTypeId(source, target);
    WEBGME_CONTROL.createConnection(type, source, target);
  };

  const getSourceAndTarget = (params) => {
    let source = null;
    if (params.sourceHandle) {
      if (nodes[global.nodeId2index[params.source]].data.inputs.hasOwnProperty(params.sourceHandle)) {
        source = nodes[global.nodeId2index[params.source]].data.inputs[params.sourceHandle].id;
      } else if (nodes[global.nodeId2index[params.source]].data.outputs.hasOwnProperty(params.sourceHandle)) {
        source = nodes[global.nodeId2index[params.source]].data.outputs[params.sourceHandle].id;
      }
    } else {
      source = params.source
    }
    
    let target = null;
    if (params.targetHandle) {
      if (nodes[global.nodeId2index[params.target]].data.inputs.hasOwnProperty(params.targetHandle)) {
        target = nodes[global.nodeId2index[params.target]].data.inputs[params.targetHandle].id;
      } else if (nodes[global.nodeId2index[params.target]].data.outputs.hasOwnProperty(params.targetHandle)) {
        target = nodes[global.nodeId2index[params.target]].data.outputs[params.targetHandle].id;
      }
    } else {
      target = params.target
    }

    return {source, target};
  };

  const isValidConnection = (params) => {
    const {source, target} = getSourceAndTarget(params);
    return global.getConnectTypeId(source, target) !== null;
  };

  const addNewElement = (id, event) => {
    WEBGME_CONTROL.addNewElement(id, event);
    setOperation('standard');
  };

  const onGoToBrowser = () => {
    const newState = {activeObject: '/f', activeVisualizer: 'WorkflowBrowser'}
      WebGMEGlobal.State.set(newState, {
          suppressVisualizerFromNode: true
      });
  };

  const onGoToParent = () => {
    const visualizer = global.parentId === '/f' ? 'WorkflowBrowser' : 'CommonWorkflowEditor';
    const newState = {activeObject: global.parentId, activeVisualizer: visualizer}
      WebGMEGlobal.State.set(newState, {
          suppressVisualizerFromNode: true
      });
  };

  const getMenu = () => {
    if(menu) {
      return (
        <Box sx={{ '& > :not(style)': { m: 1 } }} style={{position: 'fixed', zIndex: 999}}>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Close operation menu</h4>}>
            <Fab size='small' onClick={()=>{setMenu(false);}}><FontAwesomeIcon icon={icon({name: 'minus'})} size='xl'/></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Go to workflow browser</h4>}>
            <Fab size='small' onClick={()=>{onGoToBrowser();}}><FontAwesomeIcon icon={icon({name: 'house-chimney'})} size='xl'/></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Go to parent element</h4>}>
            <Fab size='small' onClick={()=>{onGoToParent();}}><FontAwesomeIcon icon={icon({name: 'arrow-up'})} size='xl'/></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Add new element to workflow</h4>}>
            <Fab size='small' onClick={()=>{setOperation('new');}}><FontAwesomeIcon icon={icon({name: 'pen-nib'})} size='xl'/></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Build and download CWL artifacts</h4>}>
            <Fab size='small' onClick={()=>{WEBGME_CONTROL.runBuildPlugin();}}><FontAwesomeIcon icon={icon({name: 'file-zipper', family: 'classic', style: 'solid'})} size='xl' /></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Export workflow model</h4>}>
            <Fab size='small' onClick={()=>{WEBGME_CONTROL.runExportPlugin();}}><FontAwesomeIcon icon={icon({name: 'file-export', family: 'classic', style: 'solid'})} size='xl' /></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Release workflow model</h4>}>
            <Fab size='small' onClick={()=>{console.log('release');}}><FontAwesomeIcon icon={icon({name: 'cloud', family: 'classic', style: 'solid'})} size='xl' /></Fab>
          </Tooltip>
        </Box>
      );
    } else {
      return (
        <Box sx={{ '& > :not(style)': { m: 1 } }} style={{position: 'fixed', zIndex: 999}}>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Open operation menu</h4>}>
            <Fab size='small' onClick={()=>{setMenu(true);}}><FontAwesomeIcon icon={icon({name: 'plus'})} size='xl'/></Fab>
            </Tooltip>
        </Box>
      );
    }
  }
  console.log('OP:',operation);
  let modalWindow;
  if (operation === 'new') {
    modalWindow = <ConfigWizard dataSchema={newElementBaseData} UISchema={{"ui:submitButtonOptions": {"submitText": "Create"}}} setFunction={addNewElement} exitFunction={()=>{setOperation('standard');}} id={'addelement'}/>;
  } else {
    modalWindow = null;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeDoubleClick={(e,edge)=> {WEBGME_CONTROL.deleteEdge(edge.id);}}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        fitView
        maxZoom={5}
        edgesUpdatable={false}
        nodesFocusable={false}
        elevateNodesOnSelect={false}>
        <Controls showInteractive={false} position="top-right"/>
        {getMenu()}
      </ReactFlow>
      {modalWindow}
    </div>  );
}
