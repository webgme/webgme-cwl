'use strict';

var config = require('./config.webgme'),
    validateConfig = require('webgme/config/validator');

// Add/overwrite any additional settings here
// config.server.port = 8080;
// config.mongo.uri = 'mongodb://127.0.0.1:27017/webgme_my_app';

//for the monaco-editor
config.requirejsPaths['vs'] = './node_modules/monaco-editor/min/vs';
config.requirejsPaths['lodash'] = './node_modules/lodash-amd/main';
config.requirejsPaths['ansi-up'] = './node_modules/ansi_up/ansi_up';
config.core.overlayShardSize = 100000;

config.requirejsPaths.react = 'node_modules/webgme-taxonomy/src/visualizers/widgets/TagCreator/lib/react.production.min';

config.seedProjects.defaultProject = 'cwl_base';

validateConfig(config);
module.exports = config;
