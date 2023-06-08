import { useContext, useState } from 'react';
import {Handle, Position, NodeToolbar, useStore, useUpdateNodeInternals} from 'reactflow';
import IconButton from '@mui/material/IconButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Tooltip from '@mui/material/Tooltip';

const nodeHeight = 30;
// const zoomSelector = (s) => s.transform[2];
function getHandleColoring(typeName) {
    let backgroundColor = 'black';
    let borderColor = 'black';
    if (typeName.indexOf('Array') !== -1) {
        borderColor = '#CA686B';
    } else {
        borderColor = '#86A5B4';
    }

    if(typeName.indexOf('String') !== -1 || typeName.indexOf('PDP') !== -1) {
        backgroundColor = '#93B5C6';
    } else if(typeName.indexOf('Directory') !== -1) {
        backgroundColor = '#DDEDAA';
    } else if(typeName.indexOf('File') !== -1) {
        backgroundColor = '#B8D1B8';
    }

    return {backgroundColor, borderColor};
}

function getInputHandles(inputs) {
    const names = Object.keys(inputs);
    names.sort();
    const handles = [];
    const step = (nodeHeight)/((names.length+1));
    let offset = step;
    names.forEach(name => {
        const style = getHandleColoring(inputs[name].type);
        style.top = offset + 'px';
        handles.push(<Tooltip key={name} title={name} arrow={true} syle={{fontSize:'24px'}}>
            <Handle id={name} type="target" position={Position.Left} style={style}/>
        </Tooltip>);
        offset += step;
    });

    return handles;
}

function getOuputHandles(outputs) {
    const names = Object.keys(outputs);
    names.sort();
    const handles = [];
    const step = (nodeHeight)/((names.length+1));
    let offset = step;
    names.forEach(name => {
        const style = getHandleColoring(outputs[name].type);
        style.top = offset + 'px';
        handles.push(<Tooltip key={name} title={name}>
            <Handle id={name} type="source" position={Position.Right} style={style}/>
        </Tooltip>);
        offset += step;
    });

    return handles;
}

const onEnterSubWorkflow = (id) => {
    const newState = {activeObject: id, activeVisualizer: 'CommonWorkflowEditor'}
    WebGMEGlobal.State.set(newState, {
        suppressVisualizerFromNode: true
    });
};

export default function WorkflowNode({id, data}) {
    // const zoom = useStore(zoomSelector)/2;
    const inputHandles = getInputHandles(data.inputs);
    const outputHandles = getOuputHandles(data.outputs);
    const update = useUpdateNodeInternals();
    const getActions = () => {
        const actions = [];
        actions.push(<FontAwesomeIcon icon={icon({name: 'up-right-from-square', family: 'classic', style: 'solid'})} size='2xs' style={{cursor:'pointer', padding:'2px'}} onClick={()=>{onEnterSubWorkflow(id);}}/>);
        actions.push(<FontAwesomeIcon icon={icon({name: 'trash-can', family: 'classic', style: 'solid'})} size='2xs' style={{cursor:'pointer', padding:'2px'}} onClick={()=>{WEBGME_CONTROL.deleteComponent(id);}}/>);
        
        return actions;
    };
    const actions = getActions();
    
    update(id);
    return (
        <>
        {inputHandles}
        <div style={{
            width: data.name.length*6 + "px", 
            height: "30px",
            minWidth:"80px",
            backgroundColor: "#ddbb92", 
            borderRadius: "3px",
            borderColor: "black",
            borderWidth: "1px",
            borderStyle: "solid",
            fontSize: "8px",
            textAlign:"center"}}>{data.name}<br/>
            {actions}
        </div>
        {outputHandles}
        </>
    );
}