import React, { useCallback, useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import ConfigWizard from '../../../../common/react/configWizard';
import Dialog from '@mui/material/Dialog';
import MDEditor, { commands } from '@uiw/react-md-editor';

import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import PublishIcon from '@mui/icons-material/Publish';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

export default function Browser(props) {
  
    const [global, setGlobal] = useState({locals:[]});
    const [operation, setOperation] = useState('normal');
    const [description, setDescription] = useState(null);
    const onUpdateFromControl = useCallback(descriptor => setGlobal(descriptor));
    
    WEBGME_CONTROL.registerUpdate(onUpdateFromControl);
  
    const FlowList = styled(List)({
      '& .MuiListItemText-root': {
        fontSize: '2em',
        minWidth:'80%'
      },
      '& .MuiIconButton-root': {
        backgroundColor:'#93ddf4',
        border:'solid',
        padding:'10px',
        borderColor:'#c3d6cb'
      }
    });

    const MarkdownDialog = styled(Dialog)({
      '& .MuiDialog-root': {
        minWidth: '50%',
        minHeight:'50%'
      },
      '& .MuiDialog-paper': {
        height: '70%',
        width: '70%'
      },
      '& .MuiButton-root': {
        width:'80px',
        left:'80%'
      }
    });

    const onEditWorkflow = (id) => {
      const newState = {activeObject: id, activeVisualizer: 'CommonWorkflowEditor'}
      WebGMEGlobal.State.set(newState, {
          suppressVisualizerFromNode: true
      });
    };

    const getModalWindow = () => {
      console.log('OP - ', operation);
      if (operation === 'new') {
        return <ConfigWizard dataSchema={
          {
            "title": "Create new Workflow",
            "description": "Create a new - empty - workflow.",
            "type": "object",
            "properties": {
                "name": {
                    "type":"string",
                    "description":"The unique name of your workflow."
                }
              }
          }
        } UISchema={{"ui:submitButtonOptions": {"submitText": "Create"}}} setFunction={createWorkflow} exitFunction={()=>{setOperation('normal');}}/>;
      } else if (operation === 'description') {
        return <MarkdownDialog open onClose={()=>{setOperation('normal');}}>
          <MDEditor 
            value={description.text} 
            onChange={(value)=>{setDescription({id:description.id,text:value});}} 
            height='90%' 
            visibleDragbar={false}
            extraCommands={[
              {
                name:'save',
                keyCommand:'save',
                buttonProps: {'aria-label': 'Save', title: 'Save description'},
                icon:<FontAwesomeIcon icon={icon({name: 'floppy-disk', family: 'classic', style: 'solid'})}/>,
                execute: (state, api) => {
                  // console.log(state);
                  WEBGME_CONTROL.setWorkflowDescription({id:description.id,text:state.text}); setDescription(null);setOperation('normal');
                }
              },
              commands.divider,
              commands.codeEdit,
              commands.codeLive,
              commands.codePreview,
              commands.fullscreen
            ]}
            />
        </MarkdownDialog>
      } else {
        return null;
      }
    };

    const createWorkflow = (id, config) => {
      WEBGME_CONTROL.createEmptyWorkflow(config.name);
      setOperation('normal');
    };

    const editDescription = (id) => {
      const text = WEBGME_CONTROL.getCurrentWorkflowDescription(id);
      if(typeof text === 'string') {
        setDescription({id,text});
        setOperation('description');
      }
    }

    const getActions = (id) => {
      return (
        <ButtonGroup size='large' fullWidth={true}>
          <Tooltip arrow title={<h3 style={{ color: "#93ddf4" }}>View or edit description of the workflow</h3>}>
            <IconButton size='small' onClick={()=>{editDescription(id);}}><FontAwesomeIcon icon={icon({name: 'paragraph', family: 'classic', style: 'solid'})} size='xl'/></IconButton>
          </Tooltip>
          <Tooltip arrow title={<h3 style={{ color: "#93ddf4" }}>Edit the workflow</h3>}>
            <IconButton size='small' onClick={()=>{onEditWorkflow(id);}}><FontAwesomeIcon icon={icon({name: 'right-to-bracket', family: 'classic', style: 'solid'})} size='xl'/></IconButton>
          </Tooltip>
          <Tooltip arrow title={<h3 style={{ color: "#93ddf4" }}>Build and download CWL artifacts</h3>}>
            <IconButton size='small'  onClick={()=>{WEBGME_CONTROL.runBuildPlugin(id);}}><FontAwesomeIcon icon={icon({name: 'file-zipper', family: 'classic', style: 'solid'})} size='xl'/></IconButton>
          </Tooltip>
          <Tooltip arrow title={<h3 style={{ color: "#93ddf4" }}>Export workflow model</h3>}>
            <IconButton size='small'  onClick={()=>{WEBGME_CONTROL.runExportPlugin(id);}}><FontAwesomeIcon icon={icon({name: 'file-export', family: 'classic', style: 'solid'})} size='xl'/></IconButton>
          </Tooltip>
          <Tooltip arrow title={<h3 style={{ color: "#93ddf4" }}>Release workflow model</h3>}>
            <IconButton size='small'  onClick={()=>{WEBGME_CONTROL.runExportPlugin(id);}}><FontAwesomeIcon icon={icon({name: 'cloud', family: 'classic', style: 'solid'})} size='xl'/></IconButton>
          </Tooltip>
          <IconButton size='small' onClick={()=>{WEBGME_CONTROL.deleteComponent(id);}}><FontAwesomeIcon icon={icon({name: 'trash-can', family: 'classic', style: 'solid'})} size='xl'/></IconButton>
        </ButtonGroup>
      );
    };

    const runImportPlugin = () => {
      WebGMEGlobal.InterpreterManager.configureAndRun(WebGMEGlobal.allPluginsMetadata['ImportWorkflow'], result => {
        console.log('import res', result);
      });
    };

    const runCoreUpdatePlugin = () => {
      console.log('TODO - run core library refresh');
      WEBGME_CONTROL.updateCoreLibrary();
    };

    const buildContent = () => {
      const items = [];
      let bcolors = ['#ddbb92','#f3cea1'];

      global.locals.forEach((localFlow, index) => {
        items.push(
          <ListItem key={localFlow.id} style={{backgroundColor:bcolors[index % 2]}}>
            <ListItemText disableTypography>{localFlow.name}</ListItemText>{getActions(localFlow.id)}
          </ListItem>
        );
      });


      return (
        <>
          {getModalWindow()}
          <ButtonGroup variant="contained" size="large">
            <Button color='warning' startIcon={<MenuIcon/>} onClick={()=>{WEBGME_CONTROL.openProjectManager();}}>Projects</Button>
            <Button color='primary' startIcon={<AddIcon/>} onClick={()=>{setOperation('new');}}>New...</Button>
            <Button color='success' startIcon={<PublishIcon/>} onClick={()=>{runImportPlugin()}}>Import...</Button>
            <Button color='warning' startIcon={<AutoStoriesIcon/>} onClick={()=>{runCoreUpdatePlugin()}}>Core Refresh</Button>
          </ButtonGroup>
          <FlowList>
            {items}
          </FlowList>
        </>
      );
    };

    return (
      <div style={{ width: '100%', height: '100%' }}>
        {buildContent()}
      </div>
    );
  }