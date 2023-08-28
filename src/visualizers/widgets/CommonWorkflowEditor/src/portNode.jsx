import { useContext, useState } from 'react';
import {Handle, Position, NodeToolbar} from 'reactflow';
import IconButton from '@mui/material/IconButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

const buttonStyle = {
    backgroundColor: "#B85F61", 
    borderRadius: "3px",
    borderColor: "black",
    borderWidth: "1px",
    borderStyle: "solid",
    cursor:'pointer', 
    padding:'2px'
};

function getHandleColoring(typeName) {
    // console.log('coloring:', typeName);
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
    const getTypeIcon = () => {
        /* maybe later add array as an icon too
        if (type.indexOf('Array') !== -1) {
            borderColor = '#CA686B';
        } else {
            borderColor = '#86A5B4';
        }*/
    
        if(type.indexOf('String') !== -1 || type.indexOf('PDP') !== -1) {
            return <FontAwesomeIcon icon={icon({name: 'font', family: 'classic', style: 'solid'})} size='1x'/>;
        } else if(type.indexOf('Directory') !== -1) {
            return <FontAwesomeIcon icon={icon({name: 'folder-open', family: 'classic', style: 'solid'})} size='1x'/>
        } else if(type.indexOf('File') !== -1) {
            return <FontAwesomeIcon icon={icon({name: 'file-lines', family: 'classic', style: 'solid'})} size='1x'/>
        }
    };

    return (
        <>
        <Tooltip title={'<<' + type.substring(4) + '>>'}><div style={{
            width: data.name.length*6.5 + "px", 
            height: "38px",
            minWidth: "38px", 
            backgroundColor: "#93ddf4", 
            borderRadius: "3px",
            borderColor: "black",
            borderWidth: "1px",
            borderStyle: "solid",
            fontSize: "8px",
            textAlign:"center",
            textSizeAdjust:"auto"}}>{getTypeIcon()}<br/>{data.name}<br/>
            <Tooltip title="Config item"><FontAwesomeIcon icon={icon({name: 'pen-to-square', family: 'classic', style: 'solid'})} size='2xs' style={buttonStyle}/></Tooltip>
            <Tooltip title="Remove item"><FontAwesomeIcon icon={icon({name: 'trash-can', family: 'classic', style: 'solid'})} size='2xs' style={buttonStyle} onClick={()=>{WEBGME_CONTROL.deleteComponent(id);}}/></Tooltip>
        </div></Tooltip>
        <Handle type={isInput?"source":"target"} position={isInput?Position.Right:Position.Left} style={style}/>
        </>
    );
}