import React, { useEffect, useState } from 'react';
import ReactFlow, { Controls, useNodesInitialized, ReactFlowProvider, useReactFlow, useOnSelectionChange } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import Grid from '@mui/material/Grid';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { SiEnvoyproxy } from "react-icons/si";
import { AiOutlineCloud } from "react-icons/ai";
import { FaFileExport, FaFileZipper } from "react-icons/fa6";
import { TfiDashboard } from "react-icons/tfi";
import { FiMinus, FiPlus } from "react-icons/fi";

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

/**
 * 
 * Operational states:
 * -standard: editing and such
 * -modal: pop-up configwizard is on
 */

function BareFlow(props) {
  const {nodes, edges, global} = props;
  const [menu, setMenu] = useState(false);
  const [selection, setSelection] = useState({nodes:[],edges:[]});
  const flow = useReactFlow();

  const [operation, setOperation] = useState('standard');


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
    console.log('who called me??');
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

  const workflowOrStepIsSelected = () => {
    // console.log(selection);
    const goodTypes = [
      'CWL.Workflow', 'CWL.DockerImage','CWL.DockerPull',
      'CWL.DockerFile','CWL.FetchFromPDP','CWL.GetFile',
      'CWL.UnzipFile','CWL.SAMatlab','CWL.BuildDockerFromDir'];
    if(selection.nodes.length > 0) {
      return goodTypes.indexOf(selection.nodes[0].data.type) !== -1;
    }
    return false;
  };

  const propagatePorts = () => {
    // console.log('G:',global);
    // console.log('S:',selection);
    WEBGME_CONTROL.runPropagatePortsPlugin(global.id, selection.nodes[0].id);
  };

  const getMenu = () => {
    if(menu) {
      const hideOperation = !workflowOrStepIsSelected();
      return (
        <Box sx={{ '& > :not(style)': { m: 1 } }} style={{position: 'fixed', zIndex: 999}}>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Close operation menu</h4>}>
            <Fab size='small' onClick={()=>{setMenu(false);}}><FiMinus size={'2em'}/></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Go to workflow browser</h4>}>
            <Fab size='small' onClick={()=>{onGoToBrowser();}}><FontAwesomeIcon icon={icon({name: 'house-chimney'})} size='xl'/></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Go to parent element</h4>}>
            <Fab size='small' onClick={()=>{onGoToParent();}}><FontAwesomeIcon icon={icon({name: 'arrow-up'})} size='xl'/></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Go to dashboard</h4>}>
            <Fab size='small' onClick={()=>{WEBGME_CONTROL.runOpenDashboardPlugin();}}><TfiDashboard size={'2em'}/></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Add new element to workflow</h4>}>
            <Fab size='small' onClick={()=>{console.log('anyone?');setOperation('new');}}><FontAwesomeIcon icon={icon({name: 'pen-nib'})} size='xl'/></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Build and download CWL artifacts</h4>}>
            <Fab size='small' onClick={()=>{WEBGME_CONTROL.runBuildPlugin();}}><FaFileZipper size={'2em'} /></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Export workflow model</h4>}>
            <Fab size='small' onClick={()=>{WEBGME_CONTROL.runExportPlugin();}}><FaFileExport size={'2em'} /></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Release workflow model</h4>}>
            <Fab size='small' onClick={()=>{console.log('release');}}><AiOutlineCloud size={'2em'}/></Fab>
          </Tooltip>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Propagate Selected components ports</h4>}>
            <span><Fab size='small' style={{backgroundColor: "#DDBB92"}} onClick={()=>{propagatePorts();}} disabled={hideOperation}><SiEnvoyproxy size={'2em'}/></Fab></span>
          </Tooltip>
        </Box>
      );
    } else {
      return (
        <Box sx={{ '& > :not(style)': { m: 1 } }} style={{position: 'fixed', zIndex: 999}}>
          <Tooltip arrow title={<h4 style={{ color: "#93ddf4" }}>Open operation menu</h4>}>
            <Fab size='small' onClick={()=>{setMenu(true);}}><FiPlus size={'2em'}/></Fab>
            </Tooltip>
        </Box>
      );
    }
  };

  const handleSelectionChange = (changes) => {
    console.log('really?', changes);
    setSelection(changes);
  }

  console.log('OP:',operation);

  const nodesInitialized = useNodesInitialized({});
  // console.log('fitting view');
  useEffect(()=>{
    if(nodesInitialized) {
      flow.fitView();
      console.log('view should be fitted');
    }
  },[nodesInitialized]);

  const getPopUp = () => {
    if (operation === 'new') {
      finishNewElementBaseData(global.wfnames2ids);
      return <ConfigWizard dataSchema={newElementBaseData} UISchema={{"ui:submitButtonOptions": {"submitText": "Create"}}} setFunction={addNewElement} exitFunction={()=>{console.log('who calls this?');setOperation('standard');}} id={'addelement'}/>;
    } else {
      return null;
    }
  }

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => setSelection({nodes, edges}),
  });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgeDoubleClick={(e,edge)=> {WEBGME_CONTROL.deleteEdge(edge.id);}}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        fitView
        maxZoom={6}
        edgesUpdatable={false}
        nodesFocusable={false}
        elevateNodesOnSelect={false}>
        <Controls showInteractive={false} position="top-right"/>
        {getMenu()}
        {getPopUp()}
      </ReactFlow>
    </div>  );
}


export default function Flow(props) {

  return (
    <ReactFlowProvider>
      <BareFlow {...props}/>
    </ReactFlowProvider>
  )
}

