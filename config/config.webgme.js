// DO NOT EDIT THIS FILE
// This file is automatically generated from the webgme-setup-tool.
'use strict';


var config = require('webgme/config/config.default'),
    validateConfig = require('webgme/config/validator');

// The paths can be loaded from the webgme-setup.json
config.plugin.basePaths.push(__dirname + '/../src/plugins');
config.plugin.basePaths.push(__dirname + '/../node_modules/webgme-json/src/plugins');
config.plugin.basePaths.push(__dirname + '/../node_modules/webgme-taxonomy/src/plugins');
config.plugin.basePaths.push(__dirname + '/../node_modules/webgme-json-importer/src/plugins');
config.seedProjects.basePaths.push(__dirname + '/../src/seeds/CWL');
config.seedProjects.basePaths.push(__dirname + '/../node_modules/webgme-taxonomy/src/seeds/taxonomy');
config.seedProjects.basePaths.push(__dirname + '/../node_modules/webgme-json-importer/src/seeds/test');



config.visualization.panelPaths.push(__dirname + '/../node_modules/webgme-json/src/visualizers/panels');
config.visualization.panelPaths.push(__dirname + '/../node_modules/webgme-taxonomy/src/visualizers/panels');
config.visualization.panelPaths.push(__dirname + '/../src/visualizers/panels');


config.rest.components['Search'] = {
  src: __dirname + '/../node_modules/webgme-taxonomy/src/routers/Search/Search.js',
  mount: 'routers/Search',
  options: {}
};
config.rest.components['TagFormat'] = {
  src: __dirname + '/../node_modules/webgme-taxonomy/src/routers/TagFormat/TagFormat.js',
  mount: 'routers/TagFormat',
  options: {}
};
config.rest.components['TagCreator'] = {
  src: __dirname + '/../node_modules/webgme-taxonomy/src/routers/TagCreator/TagCreator.js',
  mount: 'routers/TagCreator',
  options: {}
};
config.rest.components['JSONSchema'] = {
  src: __dirname + '/../node_modules/webgme-taxonomy/src/routers/JSONSchema/JSONSchema.js',
  mount: 'routers/JSONSchema',
  options: {}
};
config.rest.components['Dashboard'] = {
  src: __dirname + '/../node_modules/webgme-taxonomy/src/routers/Dashboard/Dashboard.js',
  mount: 'routers/Dashboard',
  options: {}
};

// Visualizer descriptors
config.visualization.visualizerDescriptors.push(__dirname + '/../src/visualizers/Visualizers.json');
config.visualization.visualizerDescriptors.push(__dirname + '/../node_modules/webgme-taxonomy/src/visualizers/Visualizers.json');

// Add requirejs paths
config.requirejsPaths = {
  'test': 'node_modules/webgme-json-importer/src/seeds/test',
  'taxonomy': 'node_modules/webgme-taxonomy/src/seeds/taxonomy',
  'Dashboard': 'node_modules/webgme-taxonomy/src/routers/Dashboard',
  'JSONSchema': 'node_modules/webgme-taxonomy/src/routers/JSONSchema',
  'TagCreator': 'node_modules/webgme-taxonomy/src/routers/TagCreator',
  'TagFormat': 'node_modules/webgme-taxonomy/src/routers/TagFormat',
  'Search': 'node_modules/webgme-taxonomy/src/routers/Search',
  'ExportSearchFilterData': 'node_modules/webgme-taxonomy/src/plugins/ExportSearchFilterData',
  'ExportToJSON': 'node_modules/webgme-json-importer/src/plugins/ExportToJSON',
  'SetStateFromJSON': 'node_modules/webgme-json-importer/src/plugins/SetStateFromJSON',
  'ExportToJSONSchema': 'node_modules/webgme-taxonomy/src/plugins/ExportToJSONSchema',
  'ExportOntology': 'node_modules/webgme-taxonomy/src/plugins/ExportOntology',
  'CreateConfig': 'node_modules/webgme-json/src/plugins/CreateConfig',
  'JSONToModel': 'node_modules/webgme-json/src/plugins/JSONToModel',
  'ModelToJSON': 'node_modules/webgme-json/src/plugins/ModelToJSON',
  'ImportJSON': 'node_modules/webgme-json/src/plugins/ImportJSON',
  'ExportJSON': 'node_modules/webgme-json/src/plugins/ExportJSON',
  'TagCreator': 'panels/TagCreator/TagCreatorPanel',
  'TextualJSONEditor': 'panels/TextualJSONEditor/TextualJSONEditorPanel',
  'panels': './src/visualizers/panels',
  'widgets': './src/visualizers/widgets',
  'panels/TagCreator': './node_modules/webgme-taxonomy/src/visualizers/panels/TagCreator',
  'widgets/TagCreator': './node_modules/webgme-taxonomy/src/visualizers/widgets/TagCreator',
  'panels/TextualJSONEditor': './node_modules/webgme-json/src/visualizers/panels/TextualJSONEditor',
  'widgets/TextualJSONEditor': './node_modules/webgme-json/src/visualizers/widgets/TextualJSONEditor',
  'webgme-json': './node_modules/webgme-json/src/common',
  'webgme-taxonomy': './node_modules/webgme-taxonomy/src/common',
  'webgme-json-importer': './node_modules/webgme-json-importer/src/common',
  'webgme-cwl': './src/common'
};


config.mongo.uri = 'mongodb://127.0.0.1:27017/webgme_cwl';
validateConfig(config);
module.exports = config;
