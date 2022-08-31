'use strict';

var config = require('./config.default'),
    validateConfig = require('webgme/config/validator');

// config.mongo.uri = 'mongodb://172.22.208.1:27017/webgme_cwl'; //you need to set the ip to your host machine to make it work

config.server.port = 12345;
config.authentication.enable = true;
config.authentication.allowGuests = true;
config.authentication.azureActiveDirectory.enable = true;
config.authentication.azureActiveDirectory.clientId = 'c8971ee3-9e82-48ac-88d5-4df0f44a64b4';
config.authentication.azureActiveDirectory.authority = 'https://login.microsoftonline.com/ba5a7f39-e3be-4ab3-b450-67fa80faecad';
config.authentication.azureActiveDirectory.clientSecret = 'ez27Q~T68CKnMQLZcg8HRLu-svrUrBwEstNGe';
config.plugin.allowServerExecution = true;
config.plugin.suppressRegularNotifications = true;
config.authentication.azureActiveDirectory.redirectUri = 'http://localhost:12345/aad';
validateConfig(config);
module.exports = config;
