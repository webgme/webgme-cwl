import { useContext, useState } from 'react';
import {Handle, Position, NodeToolbar} from 'reactflow';
import IconButton from '@mui/material/IconButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Tooltip from '@mui/material/Tooltip';

function getInputHandles(inputs) {
    const names = Object.keys(inputs);
    names.sort();
    const handles = [];
    let offset = 0
    names.forEach(name => {
        handles.push(<Tooltip key={name} title={name}>
            <Handle id={name} type="target" position={Position.Left} style={{top:offset+'px'}}/>
        </Tooltip>);
        offset += 10;
    });

    return handles;
}

function getOuputHandles(outputs) {
    const names = Object.keys(outputs);
    names.sort();
    const handles = [];
    names.forEach(name => {
        handles.push(<Tooltip key={name} title={name}>
            <Handle id={name} type="source" position={Position.Right}/>
        </Tooltip>);
    });

    return handles;
}

export default function PortNode({data}) {
    console.log(data);
    return (
        <>
        {getInputHandles(data.inputs)}
        <div style={{width:"60px", height:"30px", backgroundColor:"#bbb"}}>{data.name}</div>
        {getOuputHandles(data.outputs)}
        </>
    );
}