import { useContext, useState } from 'react';
import {Handle, Position, NodeToolbar} from 'reactflow';
import IconButton from '@mui/material/IconButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Tooltip from '@mui/material/Tooltip';

export default function PortNode({data}) {
    // console.log(data);

    const [showToolbar,onFlipToolbar] = useState(false);

    
    return (
        <>
        <NodeToolbar isVisible={showToolbar}>
        <Tooltip title='configure'>
            <IconButton>
                <FontAwesomeIcon icon={icon({name: 'cog'})} size="1x"/>
            </IconButton>
        </Tooltip>
        <IconButton>
            <FontAwesomeIcon icon={icon({name: 'cog'})} size="2x"/>
        </IconButton>
        <IconButton>
            <FontAwesomeIcon icon={icon({name: 'cog'})} size="3x"/>
        </IconButton>
        </NodeToolbar>
        <div className='react-flow__node-default'>
        <span>    
        <IconButton onClick={()=>{const newvalue = showToolbar? false: true; onFlipToolbar(newvalue);}}>
                <FontAwesomeIcon icon={icon({name: 'cog'})} size="sm"/>
            </IconButton>
        <FloatingLabel label="something"/>
        </span>
        </div>
        <Tooltip title='myhandle'>
            <Handle type="source" position={Position.Bottom} id="a" />
        </Tooltip>
        
        </>
    );
}