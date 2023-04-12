import { useContext, useState } from 'react';
import {Handle, Position, NodeToolbar} from 'reactflow';
import IconButton from '@mui/material/IconButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Tooltip from '@mui/material/Tooltip';

export default function PortNode({data}) {
    const {name,isInput} = data;
    return (
        <>
        <div style={{
            width: data.name.length*6 + "px", 
            height: "30px", 
            backgroundColor: "#93ddf4", 
            borderRadius: "3px",
            borderColor: "black",
            borderWidth: "1px",
            borderStyle: "solid",
            fontSize: "8px",
            textAlign:"center",
            textSizeAdjust:"auto"}}>{data.name}
        </div>
        <Handle type={isInput?"source":"target"} position={isInput?Position.Right:Position.Left}/>
        </>
    );
}