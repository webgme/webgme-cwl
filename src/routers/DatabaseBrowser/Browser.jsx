import React from 'react'
import './Browser.css'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { TextField } from '@mui/material'

import queryString from 'query-string'

class Browser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {state:'loading', rawData:null, selectedTags:[], detailedItem:null, embedded: true, selected: null, newName: ''};
    }
    componentWillMount() {
        let embedded = true;
        let type = 'data';
        setTimeout(() => {
            fetch('/routers/DatabaseBrowser/check')
            .then(res => res.json())
            .then(jsonRes => {
                // console.log(jsonRes);
                embedded = jsonRes.embedded;
                type = jsonRes.type;
                return fetch('/routers/DatabaseSelector/list/' + jsonRes.type);  
            })
            .then(res => res.json())
            .then(jsonResponse => {
                // console.log(jsonResponse);
                this.setState({state:'loaded',rawData:jsonResponse, type: type, embedded: embedded});
            })
            .catch(err => {
                console.log(err);
            });
        }, 2000);
    }
    
    getActionButton(entry) {
        if(this.state.type === 'data' && this.state.embedded) {
            return (<Button size="small" variant="outlined" color="success"
                    onClick={(e) => this.onSelectItem(entry)}>Select</Button>);
        } else if(this.state.type === 'data' && !this.state.embedded) {
            return (<Button size="small" variant="outlined" color="success"
                    onClick={(e) => this.onDownloadData(entry)}>Download</Button>);
        } else if(this.state.type === 'workflow' && this.state.embedded) {
            return (<Button size="small" variant="outlined" color="success"
                    onClick={(e) => this.onImportWorkflow(entry)}>Download</Button>);
        } else {
            return (<Button size="small" variant="outlined" color="success"
                    onClick={(e) => this.setState({detailedItem: entry, newName: ''})}>Use Workflow</Button>);
        }
    }
    getCardEntry(index, entry) {

        if(this.state.type === 'data') {
            return (
                <ListItem id={index}>
                    <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                        {entry.processId+'_'+entry.index+'_'+entry.version}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {'owner: ' + entry.observerId}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {/*<Button size="small" variant="outlined" color="secondary" onClick={() => this.setState({detailedItem:entry})}>...More...</Button>*/}
                        {this.getActionButton(entry)}
                    </CardActions>
                    </Card>
                </ListItem>
              );
        } else {
            console.log('processing-entry: ', entry);
            let metaInfo = entry.data[0] || {};
            console.log('PE-meta: ', metaInfo);
            //TODO temp massage to not fail on old items
            metaInfo.Project = metaInfo.Project || {Name:'too-old', Id:'missing!', Branch:'NaN'};
            return (
                <ListItem id={index}>
                    <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {metaInfo.Project.Name}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                            {'id: ' + entry.processId+'_'+entry.index+'_'+entry.version}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {'owner: ' + entry.observerId}
                        </Typography>
                        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                            {'StudioId: ' + metaInfo.Project.Id}
                        </Typography>
                        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                            {'Branch: ' + metaInfo.Project.Branch}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {this.getActionButton(entry)}
                    </CardActions>
                    </Card>
                </ListItem>
              );
        }
    }

    shouldBeVisible(entry) {
        console.log(entry.tags);
        let shouldBeVisible = true;
        this.state.selectedTags.forEach(tag => {
            if(entry.tags.indexOf(tag) === -1) {
                console.log('we should not see this')
                shouldBeVisible = false;
            }
        });
        return shouldBeVisible;
    }

    collectAllItems() {
        // console.log('collecting items');
        const items =[];
        let index = 0;
        this.state.rawData.forEach(entry => {
            // console.log('process-entry');
            if (this.shouldBeVisible(entry)) {
                items.push(this.getCardEntry(index++, entry));
            }
        });
        return items;
    }

    onTagSelectorChange(event, tag) {
        // console.log(event.target.checked);
        let selectedTags = this.state.selectedTags;
        if (event.target.checked) {
            selectedTags.push(tag);
        } else {
            selectedTags.splice(selectedTags.indexOf(tag), 1);
        }
        this.setState({selectedTags:selectedTags});
    }

    onSelectItem(entry) {
        //TODO collect the processid and index from the entry or the commit and projectid if its a workflow import
        // console.log('now we closin:', entry);
        if(window.parent) {
            window.parent.postMessage({processId:entry.processId,index:entry.index}, '*');
        }
    }

    onDownloadData(entry) {
        //TODO collect the processid and index from the entry or the commit and projectid if its a workflow import
        // console.log('now we closin:', entry);
        // console.log('what is love:', entry);
        window.open("/routers/DatabaseSelector/data/"+ entry.processId + "/" + entry.index);
    }

    onImportWorkflow(entry) {
        console.log('not implemnted yet');
    }

    onBootstrapWorkflow(entry, newName) {
        console.log('BSP:', entry);
        fetch('/routers/DatabaseSelector/boot/' + entry.processId + '/' + entry.index + '/' + newName)
        .then(res => res.json())
        .then(jsonRes => {})
        .catch(e => {
            console.error(e);
        });
        // window.open("/routers/DatabaseSelector/boot/" + entry.processId + "/" + entry.index + "/" + newName);
        this.setState({detailedItem:null, newName: ''});
    }

    showTags() {
        // console.log(this.state.selectedTags);
        const tags = [];
        let index = 0;
        /*this.state.rawData.tags.forEach(tag => {
            if (this.state.selectedTags.indexOf(tag) === -1) {
                tags.push(<FormControlLabel id={index++} control={<Switch onChange={e=> {this.onTagSelectorChange(e, tag);}}/>} label={tag} />);
            } else {
                tags.push(<FormControlLabel id={index++} control={<Switch defaultChecked onChange={e=> {this.onSelectItem(e, tag);}}/>} label={tag} />);
            }
        });*/

        return (
            <FormGroup>
              {tags}
            </FormGroup>
          );
    }

    getHeader() {
        let headerTitle = 'OOPS';
        if (this.state.type === 'data' && this.state.embedded) {
            headerTitle = 'Please select the source of your data';
        } else if (this.state.type === 'workflow' && this.state.embedded){
            headerTitle = 'Please select a workflow to import';
        } else if (this.state.type === 'data') {
            //standalone data
            headerTitle = 'Manage your data';
        } else {
            //standalone data
            headerTitle = 'Pick a workflow to initiate your new one';
        }

        return (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {headerTitle}
                    </Typography>
                </Toolbar>
            </AppBar>
            );
    }

    getNewProjectNameDialog() {
        if(this.state.detailedItem === null) {
            return null;
        }

        // console.log(this.state.newName);
        let textfield = null;
        let actions = [];
        const newName = this.state.newName || '';
        if(newName.length === 0) {
            textfield = (<TextField
                error
                label="Error"
                defaultValue="UniqueName"
                variant="standard"
                helperText="Empty name is invalid!"
                onChange={(e) => this.setState({newName:e.target.value})}
                />
            );
            actions = [<Button onClick={()=> {this.setState({detailedItem:null, newName:''});}} autoFocus>Cancel</Button>];
        } else {
            textfield = (<TextField
                defaultValue={this.state.newName}
                variant="standard"
                onChange={(e) => this.setState({newName:e.target.value})}
                />
            );
            
            actions = [<Button id="item-one-button" onClick={()=> {this.onBootstrapWorkflow(this.state.detailedItem, this.state.newName);}} autoFocus>Create</Button>];
            actions.push(<Button id="item-one-button" onClick={()=> {this.setState({detailedItem:null, newName:''});}}>Cancel</Button>);
        }

        return (
        <Dialog
            open={this.state.detailedItem !== null}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Please give a uniqie name to your new workflow"}</DialogTitle>
            <DialogContent>
                {textfield}
            </DialogContent>
            <DialogActions>
                {actions}
            </DialogActions>
        </Dialog>
        );
    }

    render() {
    // console.log('rendering');
    const detailedItem = this.state.detailedItem ? this.state.detailedItem : {pid:null};
    // const detailedItemText = JSON.stringify(detailedItem, null, 2);
    // detailedItemText = detailedItemText.replace(/(?:\r\n|\r|\n)/g, '<br>');
    // console.log(detailedItemText);
    if (this.state.state === 'loading') {
        // console.log('waiting');
        return (
        <div>
            <LinearProgress color="secondary" />
            <LinearProgress color="success" />
            <LinearProgress color="inherit" />
        </div>);
    }

    return (
    <div className="Browser">
        {this.getNewProjectNameDialog()}
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {this.getHeader()}
                <Grid item xs={6} md={4} lg={2}>
                    {this.showTags()}
                </Grid>
                <Grid item xs={6} md={8} lg={10}>
                    <List>{this.collectAllItems()}</List>
                </Grid>
            </Grid>
        </Box>
    </div>);
  }
}

export default Browser
