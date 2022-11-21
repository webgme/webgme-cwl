/*globals define, WebGMEGlobal*/
/**
 * Example of custom plugin configuration. Typically a dialog would show up here.
 * @author kecso / https://github.com/kecso
 */

 define([
    'text!./config.html',
    'ansi-up',
    'blob/BlobClient',
    'css!./config.css',
 ], function (DialogTemplate, AnsiUp, BlobClient) {
    'use strict';

    function ConfigWidget(params) {
        this._client = params.client;
        this._logger = params.logger.fork('ConfigWidget');
        this._AU = new AnsiUp.default();
        this._bc = new BlobClient({logger:this._logger.fork('BlobClient')});
    }

    /**
     * Called by the InterpreterManager if pointed to by metadata.configWidget.
     * You can reuse the default config by including it from 'js/Dialogs/PluginConfig/PluginConfigDialog'.
     *
     * @param {object[]} globalConfigStructure - Array of global options descriptions (e.g. runOnServer, namespace)
     * @param {object} pluginMetadata - The metadata.json of the the plugin.
     * @param {object} prevPluginConfig - The config at the previous (could be stored) execution of the plugin.
     * @param {function} callback
     * @param {object|boolean} callback.globalConfig - Set to true to abort execution otherwise resolved global-config.
     * @param {object} callback.pluginConfig - Resolved plugin-config.
     * @param {boolean} callback.storeInUser - If true the pluginConfig will be stored in the user for upcoming execs.
     *
     */
    ConfigWidget.prototype.show = function (globalConfigStructure, pluginMetadata, prevPluginConfig, callback) {
        var pluginConfig = JSON.parse(JSON.stringify(prevPluginConfig)), // Make a copy of the prev config
            globalConfig = {},
            activeNodeId = WebGMEGlobal.State.getActiveObject(),
            activeNode;

        console.log('PSTART:', globalConfigStructure);
        // We use the default global config here..
        globalConfigStructure.forEach(function (globalOption) {
            globalConfig[globalOption.name] = globalOption.value;
        });

        if (typeof activeNodeId === 'string') {
            activeNode = this._client.getNode(activeNodeId);
            pluginConfig.activeNodeName = activeNode.getAttribute('name');
        } else {
            this._logger.error('No active node...');
            callback(true); // abort execution
            return;
        }

        let src = '/routers/DatabaseBrowser/start?';
        src += 'path='+decodeURI(activeNode.getId());
        src += '&projectid='+ this._client.getActiveProjectId();

        const dialog = $(DialogTemplate);
        dialog.on('shown', function () {
            //TODO we might want to handle something here
        });

        const listener = data => {
            console.log('message arrived:', data);
            window.removeEventListener('message', listener);
            dialog.modal('hide');
            if (data.origin === window.location.origin) {
                try {
                    const msg = JSON.parse(data.data);
                    if (msg.type === 'selectArtifact') {
                        callback(globalConfig, {value:msg.value}, false);
                    } else {
                        console.error('Invalid message type!');
                        callback(globalConfig, {value:null}, false);
                    }
                } catch (e) {
                    console.error(e);
                    callback(globalConfig, {value:null}, false);
                }
            } else {
                console.error('Only same origin clients can communicate!!!');
                callback(globalConfig, {value:null}, false);
            }
        };
        
        window.addEventListener('message', listener);
        
        //showing dialog
        dialog.modal('show');
        
    };

    return ConfigWidget;
});