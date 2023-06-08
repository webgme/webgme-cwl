import { useContext, useState } from 'react';
import {Handle, Position, NodeToolbar} from 'reactflow';
import IconButton from '@mui/material/IconButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

function getHandleColoring(typeName) {
    console.log('coloring:', typeName);
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

export default function PortNode({id, data}) {
    const {name, isInput, type} = data;
    const style = getHandleColoring(type);
    return (
        <>
        <div style={{
            width: data.name.length*6 + "px", 
            height: "30px",
            minWidth: "60px", 
            backgroundColor: "#93ddf4", 
            borderRadius: "3px",
            borderColor: "black",
            borderWidth: "1px",
            borderStyle: "solid",
            fontSize: "8px",
            textAlign:"center",
            textSizeAdjust:"auto"}}>{data.name}<br/>
            <FontAwesomeIcon icon={icon({name: 'pen-to-square', family: 'classic', style: 'solid'})} size='2xs' style={{cursor:'pointer', padding:'2px'}}/>
            <FontAwesomeIcon icon={icon({name: 'trash-can', family: 'classic', style: 'solid'})} size='2xs' style={{cursor:'pointer', padding:'2px'}} onClick={()=>{WEBGME_CONTROL.deleteComponent(id);}}/>
        </div>
        <Handle type={isInput?"source":"target"} position={isInput?Position.Right:Position.Left} style={style}/>
        </>
    );
}