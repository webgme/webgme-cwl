import { useContext, useState } from 'react';
import {Handle, Position, NodeToolbar, useStore, useUpdateNodeInternals} from 'reactflow';
import IconButton from '@mui/material/IconButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Tooltip from '@mui/material/Tooltip';

const nodeHeight = 30;
const zoomSelector = (s) => s.transform[2];

function getInputHandles(inputs) {
    const names = Object.keys(inputs);
    names.sort();
    const handles = [];
    const step = (nodeHeight)/((names.length+1));
    let offset = step;
    names.forEach(name => {
        handles.push(<Tooltip key={name} title={name}>
            <Handle id={name} type="target" position={Position.Left} style={{top:offset+"px"}}/>
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
        handles.push(<Tooltip key={name} title={name}>
            <Handle id={name} type="source" position={Position.Right} style={{top:offset+"px"}}/>
        </Tooltip>);
        offset += step;
    });

    return handles;
}

export default function PortNode({id, data}) {
    // console.log(data);
    const zoom = useStore(zoomSelector)/2;
    const inputHandles = getInputHandles(data.inputs);
    const outputHandles = getOuputHandles(data.outputs);
    const update = useUpdateNodeInternals();
    update(id);
    return (
        <>
        {inputHandles}
        <div style={{
            width: data.name.length*6 + "px", 
            height: "30px", 
            backgroundColor: "#f3cea1", 
            borderRadius: "3px",
            borderColor: "black",
            borderWidth: "1px",
            borderStyle: "solid",
            fontSize: "8px",
            textAlign:"center",
            paddingTop:"10px"}}>{data.name}</div>
        {outputHandles}
        </>
    );
}