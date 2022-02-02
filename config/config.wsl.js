'use strict';

var config = require('./config.default'),
    validateConfig = require('webgme/config/validator');

config.mongo.uri = 'mongodb://172.27.208.1:27017/webgme_cwl'; //you need to set the ip to your host machine to make it work

validateConfig(config);
module.exports = config;