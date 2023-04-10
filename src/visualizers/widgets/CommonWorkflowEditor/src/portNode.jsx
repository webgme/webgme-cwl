import { useContext } from 'react';
import {Handle, Position, NodeToolbar} from 'reactflow';
import IconButton from '@mui/material/IconButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Tooltip from '@mui/material/Tooltip';

export default function PortNode({data}) {
    // console.log(data);
    return (
        <>
        <NodeToolbar isVisible={data.toolbarVisible}>
        <Tooltip title='configure'>
            <IconButton>
                <FontAwesomeIcon icon={icon({name: 'cog'})} size="sm"/>
            </IconButton>
        </Tooltip>
        </NodeToolbar>
        <div className='react-flow__node-default'>
        <FloatingLabel label="something"/>
        </div>
        <Tooltip title='myhandle'>
            <Handle type="source" position={Position.Bottom} id="a" />
        </Tooltip>
        
        </>
    );
}