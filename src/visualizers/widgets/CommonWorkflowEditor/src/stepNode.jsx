import React, { useContext, useState } from 'react';
import {Handle, Position, NodeToolbar, useStore, useUpdateNodeInternals} from 'reactflow';
import IconButton from '@mui/material/IconButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

//config wizardry
import ConfigWizard from '../../../../common/react/configWizard';
import newInputPortData from '../../../../common/wizards/NewInputPort.data.json';
import newInputPortUI from '../../../../common/wizards/NewInputPort.ui.json';
import newOutputPortData from '../../../../common/wizards/NewOutputPort.data.json';
import newOutputPortUI from '../../../../common/wizards/NewOutputPort.ui.json';
import stepWizards from '../../../../common/wizards/steps';
import steps from '../../../../common/wizards/steps';

const nodeHeight = 38;
const buttonStyle = {
    backgroundColor: "#B85F61", 
    borderRadius: "3px",
    borderColor: "black",
    borderWidth: "1px",
    borderStyle: "solid",
    cursor:'pointer', 
    padding:'2px'
};
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

function getInputHandles(inputs, handleFn) {
    const names = Object.keys(inputs);
    names.sort();
    const handles = [];
    const step = (nodeHeight)/((names.length+1));
    let offset = step;
    names.forEach(name => {
        const style = getHandleColoring(inputs[name].type);
        style.top = offset + 'px';
        handles.push(<Tooltip key={name} title={name} arrow={true} syle={{fontSize:'24px'}}>
            <Handle id={name} type="target" position={Position.Left} style={style} onContextMenu={(event)=>{
                event.preventDefault();
                handleFn(event, name, true);
            }}/>
        </Tooltip>);
        offset += step;
    });

    return handles;
}

function getOuputHandles(outputs, handleFn) {
    const names = Object.keys(outputs);
    names.sort();
    const handles = [];
    const step = (nodeHeight)/((names.length+1));
    let offset = step;
    names.forEach(name => {
        const style = getHandleColoring(outputs[name].type);
        style.top = offset + 'px';
        handles.push(<Tooltip key={name} title={name}>
            <Handle id={name} type="source" position={Position.Right} style={style} onContextMenu={(event)=>{
                event.preventDefault();
                handleFn(event, name, false);
            }}/>
        </Tooltip>);
        offset += step;
    });

    return handles;
}

export default function StepNode({id, data}) {
    // const zoom = useStore(zoomSelector)/2;
    const [contextMenu, setContextMenu] = React.useState(null);
    const [configWizard, setCofigWizard] = React.useState(null);

    const getTypeIcon = () => {
        switch (data.type) {
            case 'CWL.DockerPull':
            case 'CWL.DockerFile':
            case 'CWL.DockerImage':
                return <FontAwesomeIcon icon={icon({name: 'docker', family: 'classic', style: 'brands'})} size='1x'/>;
            case 'CWL.FetchFromPDP':
                return <FontAwesomeIcon icon={icon({name: 'database', family: 'classic', style: 'solid'})} size='1x'/>;
            case 'CWL.SAMatlab':
                return <FontAwesomeIcon icon={icon({name: 'cash-register', family: 'classic', style: 'solid'})} size='1x'/>;
            case 'CWL.UnzipFile':
                return <FontAwesomeIcon icon={icon({name: 'file-zipper', family: 'classic', style: 'solid'})} size='1x'/>;
            case 'CWL.GetFile':
                return <FontAwesomeIcon icon={icon({name: 'file-export', family: 'classic', style: 'solid'})} size='1x'/>;
            default:
                return <FontAwesomeIcon icon={icon({name: 'shoe-prints', family: 'classic', style: 'solid'})} size='1x'/>;
        }
    };

    const handleContextMenu = (event, name, isInput) => {
        event.preventDefault();
        setContextMenu(
          contextMenu === null
            ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
                focusedParam: name,
                isInput: isInput
              }
            : null
        );
    };
    const handleContextMenuClose = () => {
        setContextMenu(null);
      };

    const removePort = () => {
        const id = contextMenu.isInput ? data.inputs[contextMenu.focusedParam].id : data.outputs[contextMenu.focusedParam].id;
        WEBGME_CONTROL.deleteComponent(id);
        handleContextMenuClose();
    };

    const addInput = () => {
        console.log(data.inputs);
        const names = Object.keys(data.inputs);
        newInputPortData.properties.name.not.enum = names;

        setCofigWizard({schema:newInputPortData,ui:newInputPortUI,cb:processNewInput});
    };
    const processNewInput = (formId, formData) => {
        WEBGME_CONTROL.createInput(id, formData);
        setCofigWizard(null);
    };

    const fillNewOutputConfig = () => {
        newOutputPortData.allOf[1].then.properties.reference.enum = Object.keys(data.inputs);

    };
    const addOutput = () => {
        fillNewOutputConfig();
        setCofigWizard({schema:newOutputPortData,ui:newOutputPortUI,cb:processNewOutput});
    };
    const processNewOutput = (formId, formData) => {
        console.log(id, formData);
        if(formData.reference) {
            formData.reference = data.inputs[formData.reference];
        }
        WEBGME_CONTROL.createOutput(id, formData);
        setCofigWizard(null);
    };

    const configStep = () => {
        const wizard = steps[data.type.substring(4)];
        // console.log(data.type.substring(4));
        // console.log(data);
        setCofigWizard({schema:wizard.data, ui:wizard.ui,cb:processConfigStep,data:data.attributes});
    };

    const processConfigStep = (formId, formData) => {
        WEBGME_CONTROL.setAttributes(id, formData, data.attributes);
        setCofigWizard(null);
    };

    const inputHandles = getInputHandles(data.inputs, handleContextMenu);
    const outputHandles = getOuputHandles(data.outputs, handleContextMenu);
    const update = useUpdateNodeInternals();
    const getActions = () => {
        const actions = [];
        if(data.variablePorts) {
            actions.push(<Tooltip key="inport" title="Add new input"><FontAwesomeIcon icon={icon({name: 'arrow-right-to-bracket', family: 'classic', style: 'solid'})} size='2xs' style={buttonStyle} onClick={()=>{addInput();}}/></Tooltip>);
        }
        actions.push(<Tooltip key="config" title="Config step"><FontAwesomeIcon icon={icon({name: 'gear', family: 'classic', style: 'solid'})} size='2xs' style={buttonStyle} onClick={()=>{configStep();}}/></Tooltip>);
        actions.push(<Tooltip key="delete" title="Delete step"><FontAwesomeIcon icon={icon({name: 'trash-can', family: 'classic', style: 'solid'})} size='2xs' style={buttonStyle} onClick={()=>{WEBGME_CONTROL.deleteComponent(id);}}/></Tooltip>);
        if(data.variablePorts) {
            actions.push(<Tooltip key="outport" title="Add new output"><FontAwesomeIcon icon={icon({name: 'arrow-right-from-bracket', family: 'classic', style: 'solid'})} size='2xs' style={buttonStyle} onClick={()=>{addOutput();}}/></Tooltip>);
        }

        return actions;
    };
    const actions = getActions();
    
    update(id);

    let configWizardDialog = null;

    if (configWizard) {
        configWizardDialog = <ConfigWizard dataSchema={configWizard.schema} UISchema={configWizard.ui} setFunction={configWizard.cb} exitFunction={()=>{setCofigWizard(null);}} id={'add-input'} defaultData={configWizard.data}/>
    }

    return (
        <>
        {inputHandles}
        <Tooltip title={'<<' + data.type.substring(4) + '>>'}><div style={{
            width: data.name.length*6.5 + "px", 
            height: "38px",
            minWidth:"76px",
            backgroundColor: "#F3CEA1", 
            borderRadius: "3px",
            borderColor: "black",
            borderWidth: "1px",
            borderStyle: "solid",
            fontSize: "8px",
            textAlign:"center"}}>
            {getTypeIcon()}
            <br/>{data.name}<br/>
            {actions}
        </div></Tooltip>
        {outputHandles}
        <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        >
            <MenuItem onClick={console.log(contextMenu ? contextMenu.focusedParam : 'na')}>Edit parameter</MenuItem>
            <MenuItem onClick={() => {removePort();}}>Delete Parameter</MenuItem>
        </Menu>
        {configWizardDialog}
        </>
    );
}