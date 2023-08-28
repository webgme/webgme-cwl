import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import Flow from './mainFlow';
import dagre from 'dagre';

const container = document.getElementById(VISUALIZER_INSTANCE_ID);
const root = ReactDOMClient.createRoot(container);
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 78;
const nodeHeight = 38;

const getLayoutedElements = (nodes, edges) => {
  dagreGraph.setGraph({ rankdir: 'LR', nodesep:40, ranksep:40});
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = 'left';
    node.sourcePosition = 'right';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });
  
  edges.forEach(edge => {
    edge.markerEnd = {type:'arrowclosed'};
    edge.interactionWidth = 2;
    edge.style = {color:'black'};
  });

  return { nodes, edges };
};

const onUpdateFromControl = (descriptor) => {
    console.log('rendering', descriptor);
    const layouted = getLayoutedElements(descriptor.nodes, descriptor.edges);
    root.render(<Flow nodes = {layouted.nodes} edges = {layouted.edges} global = {descriptor.global}/>);
};

console.log('connecting to control');
WEBGME_CONTROL.registerUpdate(onUpdateFromControl);