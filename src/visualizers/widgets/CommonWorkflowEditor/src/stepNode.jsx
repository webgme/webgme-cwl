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
import steps from '../../../../common/wizards/steps';
import configPositional from '../../../../common/wizards/ConfigPositionalInput.data.json';
import configNamed from '../../../../common/wizards/ConfigNamedInput.data.json';
import configLocation from '../../../../common/wizards/ConfigLocationInput.data.json';
import configReference from '../../../../common/wizards/ConfigOutputReference.data.json';
import configPattern from '../../../../common/wizards/ConfigPatternOutput.data.json';

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
        let title = name;
        if(inputs[name].attributes.position !== -1 && inputs[name].attributes.asArgument) {
            title += ' [' + inputs[name].attributes.position + ']';
        }
        handles.push(<Tooltip key={name} title={title} arrow={true} syle={{fontSize:'24px'}}>
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
        const portId = contextMenu.isInput ? data.inputs[contextMenu.focusedParam].id : data.outputs[contextMenu.focusedParam].id;
        const containerId = contextMenu.isInput ? id : null;
        WEBGME_CONTROL.deleteComponent(portId, containerId);
        handleContextMenuClose();
    };

    const configPort = () => {
        const invalidNames = [].concat(Object.keys(data.inputs), Object.keys(data.outputs));
        invalidNames.splice(invalidNames.indexOf(data.inputs[contextMenu.focusedParam].attributes.name), 1);
        if (contextMenu.isInput) {
            const attributes = data.inputs[contextMenu.focusedParam].attributes;
            if(attributes.position !== -1) {
                attributes.role = 'positional';
                configPositional.properties.name.not.enum = invalidNames;
                configPositional.properties.position.enum = Object.keys(data.order.name2id);
                configPositional.properties.position.enum.splice(Object.keys(data.order.name2id).indexOf(contextMenu.focusedParam), 1);
                configPositional.properties.position.enum.unshift('_first_');
                setCofigWizard({schema:configPositional, ui:{}, cb:processConfigInput, exitFunction:clearAllPopups, data:attributes});
            } else if(attributes.asArgument) {
                attributes.role = 'named';
                configNamed.properties.name.not.enum = invalidNames;
                setCofigWizard({schema:configNamed, ui:{}, cb:processConfigInput, exitFunction:clearAllPopups, data:attributes});
            } else {
                attributes.role = 'location';
                configLocation.properties.name.not.enum = invalidNames;
                setCofigWizard({schema:configLocation, ui:{}, cb:processConfigInput, exitFunction:clearAllPopups, data:attributes});
            }
        } else {
            //output variants
            const source = data.outputs[contextMenu.focusedParam].source;
            const attributes = data.outputs[contextMenu.focusedParam].attributes;

            if(source) {
                //reference based output
                configReference.properties.reference.enum = Object.keys(data.inputs);
                configReference.properties.name.not.enum = invalidNames;
                const currentData = {name: attributes.name};
                Object.keys(data.inputs).forEach(input => {
                    if(data.inputs[input].id === source) {
                        currentData.reference = data.inputs[input].attributes.name;
                    }
                });
                setCofigWizard({schema:configReference, ui:{}, cb:processConfigOutput, exitFunction:clearAllPopups, data:currentData});
            } else {
                configPattern.properties.name.not.enum = invalidNames;
                const currentData = {name: attributes.name, pattern: attributes.pattern};
                setCofigWizard({schema:configPattern, ui:{}, cb:processConfigOutput, exitFunction:clearAllPopups, data:currentData});
            }
        }
        // setCofigWizard({schema:newInputPortData,ui:newInputPortUI,cb:processNewInput});
    };

    const processConfigInput = (formId, formData) => {
        WEBGME_CONTROL.updateInput(id, data.inputs[contextMenu.focusedParam].id, formData);
        clearAllPopups();
    };

    const processConfigOutput = (formId, formData) => {
        if(formData.reference) {
            formData.reference = data.inputs[formData.reference].id;
        }
        WEBGME_CONTROL.updateOutput(data.outputs[contextMenu.focusedParam].id, formData);
        clearAllPopups();
    };

    const clearAllPopups = () => {
        console.log('removing all popups');
        setCofigWizard(null);
        setContextMenu(null);
    }

    const addInput = () => {
        newInputPortData.properties.name.not.enum = [].concat(Object.keys(data.inputs), Object.keys(data.outputs));
        newInputPortData.allOf[1].then.properties.position.enum = Object.keys(data.order.name2id);
        newInputPortData.allOf[1].then.properties.position.enum.unshift('_first_');


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
        newOutputPortData.properties.name.not.enum = [].concat(Object.keys(data.inputs), Object.keys(data.outputs));
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
        const defaultExitFunction = () => {setCofigWizard(null);}
        configWizardDialog = <ConfigWizard dataSchema={configWizard.schema} UISchema={configWizard.ui} setFunction={configWizard.cb} exitFunction={configWizard.exitFunction || defaultExitFunction} id={'add-input'} defaultData={configWizard.data}/>
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
            <MenuItem onClick={() => {configPort();}}>Edit parameter</MenuItem>
            <MenuItem onClick={() => {removePort();}}>Delete Parameter</MenuItem>
        </Menu>
        {configWizardDialog}
        </>
    );
}