import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import Browser from './browser';

const container = document.getElementById(VISUALIZER_INSTANCE_ID);
const root = ReactDOMClient.createRoot(container);
root.render(<Browser></Browser>);