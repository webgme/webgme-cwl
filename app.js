// jshint node: true
'use strict';
process.chdir(__dirname);

var gmeConfig = require('./config'),
    webgme = require('webgme'),
    myServer;

webgme.addToRequireJsPaths(gmeConfig);
// console.log(JSON.stringify(gmeConfig, null, 2));
myServer = new webgme.standaloneServer(gmeConfig);
myServer.start(function (err) {
    // console.log('server up');
    console.log(err);
});
