import { useState } from 'react';
import {Handle, Position, NodeToolbar} from 'reactflow';
import IconButton from '@mui/material/IconButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { VscReferences } from "react-icons/vsc";

import ConfigWizard from '../../../../common/react/configWizard';

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
    const {name, isInput, type, value, location} = data;
    const style = getHandleColoring(type);

    const [configWizard, setCofigWizard] = useState(null);

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

    const setDefault = () => {

        const schema = {
            "title":"Set default value",
            "type":"object",
            "properties":{
                "value":{
                    "type":"string",
                    "description":"the default content of the file"
                }
            }
        };
        const ui = {
            "value":{"ui:widget":"textarea","ui:options":{"rows":"10"}}
        };

        if (type === 'CWL.FileInput') {
            schema.properties.name = {"type": "string","description":"the name of the file to generate with the default content"};
            setCofigWizard({id:'popup', schema:schema, ui:ui, cb:onSetDefault, data:{value, name:location}});
        } else if (type === 'CWL.StringInput') {
            schema.properties.value.description = "the default value of the string";
            setCofigWizard({id:'popup', schema:schema, ui:{}, cb:onSetDefault, data:{value}});
        } else if (type === 'CWL.DirectoryInput') {
            schema.properties.value.description = "set the default place of the directory input's place-holder relative to the main artifact directory - has to start with ./";
            schema.properties.value.pattern = '^\.\/';
            setCofigWizard({id:'popup', schema:schema, ui:{}, cb:onSetDefault, data:{value:location}});
        }
    };

    const onSetDefault = (formId, formData) => {
        console.log(formData);
        WEBGME_CONTROL.setInputDefault(id, type, formData);
    };

    const getActions = () => {
        if (isInput && type.indexOf('Array') === -1) {
            if(type === 'CWL.PDPiD') {
                return <span>
                    <Tooltip title="Set default source"><VscReferences size={'1.4em'} style={buttonStyle} onClick={() => {WEBGME_CONTROL.runSelectDataSourcePlugin(id);}}/></Tooltip>
                    <Tooltip title="Delete"><FontAwesomeIcon icon={icon({name: 'trash-can', family: 'classic', style: 'solid'})} size='2xs' style={buttonStyle} onClick={()=>{WEBGME_CONTROL.deleteComponent(id);}}/></Tooltip>
                </span>;
            } else {
                return <span>
                    <Tooltip title="Set default value"><FontAwesomeIcon icon={icon({name: 'pen-to-square', family: 'classic', style: 'solid'})} size='2xs' style={buttonStyle} onClick={() => {setDefault();}}/></Tooltip>
                    <Tooltip title="Delete"><FontAwesomeIcon icon={icon({name: 'trash-can', family: 'classic', style: 'solid'})} size='2xs' style={buttonStyle} onClick={()=>{WEBGME_CONTROL.deleteComponent(id);}}/></Tooltip>
                </span>;
            }
        } else {
            return <Tooltip title="Delete"><FontAwesomeIcon icon={icon({name: 'trash-can', family: 'classic', style: 'solid'})} size='2xs' style={buttonStyle} onClick={()=>{WEBGME_CONTROL.deleteComponent(id);}}/></Tooltip>;
        }
    };

    let configWizardDialog = null;

    if (configWizard) {
        configWizardDialog = <ConfigWizard dataSchema={configWizard.schema} UISchema={configWizard.ui} setFunction={configWizard.cb} exitFunction={() => setCofigWizard(null)} id={'pop-up'} defaultData={configWizard.data}/>
    }

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
            {getActions()}
        </div></Tooltip>
        <Handle type={isInput?"source":"target"} position={isInput?Position.Right:Position.Left} style={style}/>
        {configWizardDialog}
        </>
    );
}