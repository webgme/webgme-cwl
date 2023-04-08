import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import Flow from './mainFlow';

/*
window.WebGMEGlobal.WebGMEReactPanels[VISUALIZER_INSTANCE_ID].initialized = true;

window.WebGMEGlobal.WebGMEReactPanels[VISUALIZER_INSTANCE_ID].stateMediator.onDestroy = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById(VISUALIZER_INSTANCE_ID));
};*/
const container = document.getElementById(VISUALIZER_INSTANCE_ID);
const root = ReactDOMClient.createRoot(container);

root.render(<Flow control={WEBGME_CONTROL} panel={WEBGME_PANEL}></Flow>);