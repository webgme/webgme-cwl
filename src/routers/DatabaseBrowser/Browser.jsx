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

import queryString from 'query-string'

class Browser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {state:'loading', rawData:null, selectedTags:[], detailedItem:null};
    }
    componentWillMount() {
        setTimeout(() => {
            fetch('/routers/DatabaseBrowser/data')
            .then(res => res.json())
            .then(jsonResponse => {
                console.log(jsonResponse);
                this.setState({state:'loaded',rawData:jsonResponse, type: jsonResponse.type});
            })
            .catch(err => {
                console.log(err);
            });
        }, 2000);
    }
    
    getCardEntry(index, entry) {

        return (
            <ListItem id={index}>
                <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {entry.pid}
                    </Typography>
                    <Typography variant="h5" component="div">
                    {entry.metadata.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" variant="outlined" color="secondary" onClick={() => this.setState({detailedItem:entry})}>...More...</Button>
                    <Button size="small" variant="outlined" color="success"
                    onClick={(e) => this.onSelectItem(e, entry)}>Select</Button>
                </CardActions>
                </Card>
            </ListItem>
          );
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
        console.log('collecting items');
        const items =[];
        let index = 0;
        this.state.rawData.data.forEach(entry => {
            console.log('process-entry');
            if (this.shouldBeVisible(entry)) {
                items.push(this.getCardEntry(index++, entry));
            }
        });
        return items;
    }

    onTagSelectorChange(event, tag) {
        console.log(event.target.checked);
        let selectedTags = this.state.selectedTags;
        if (event.target.checked) {
            selectedTags.push(tag);
        } else {
            selectedTags.splice(selectedTags.indexOf(tag), 1);
        }
        this.setState({selectedTags:selectedTags});
    }

    onSelectItem(event, entry) {
        //TODO collect the processid and index from the entry or the commit and projectid if its a workflow import
        // console.log('now we closin:', entry);
        if(window.parent) {
            window.parent.postMessage({processId:entry.pid}, '*');
        }
    }

    showTags() {
        console.log(this.state.selectedTags);
        const tags = [];
        let index = 0;
        this.state.rawData.tags.forEach(tag => {
            if (this.state.selectedTags.indexOf(tag) === -1) {
                tags.push(<FormControlLabel id={index++} control={<Switch onChange={e=> {this.onTagSelectorChange(e, tag);}}/>} label={tag} />);
            } else {
                tags.push(<FormControlLabel id={index++} control={<Switch defaultChecked onChange={e=> {this.onSelectItem(e, tag);}}/>} label={tag} />);
            }
        });

        return (
            <FormGroup>
              {tags}
            </FormGroup>
          );
    }

    getHeader() {
        if (this.state.type === 'data') {
            return (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Please select the source of your data
                    </Typography>
                </Toolbar>
            </AppBar>
            );
        } else {
            return (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Please select a workflow to import
                    </Typography>
                </Toolbar>
            </AppBar>
            );
        }
    }
    render() {
    console.log('rendering');
    const detailedItem = this.state.detailedItem ? this.state.detailedItem : {pid:null};
    const detailedItemText = JSON.stringify(detailedItem, null, 2);
    // detailedItemText = detailedItemText.replace(/(?:\r\n|\r|\n)/g, '<br>');
    console.log(detailedItemText);
    if (this.state.state === 'loading') {
        console.log('waiting');
        return (
        <div>
            <LinearProgress color="secondary" />
            <LinearProgress color="success" />
            <LinearProgress color="inherit" />
        </div>);
    }
    return (
    <div className="Browser">
        <Dialog
            open={this.state.detailedItem !== null}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Complete Info of ["+detailedItem.pid+"]"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" className="display-linebreak">
                    {detailedItemText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=> {this.setState({detailedItem:null});}} autoFocus>Ok</Button>
            </DialogActions>
        </Dialog>
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
