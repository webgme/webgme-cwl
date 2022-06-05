/*globals define, WebGMEGlobal*/
/**
 * Example of custom plugin configuration. Typically a dialog would show up here.
 * @author pmeijer / https://github.com/pmeijer
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

        const dialog = $(DialogTemplate);
        dialog.on('hidden.bs.modal', function () {
            //TODO do we need to do something extra here???
        });

        dialog.on('shown', function () {
            //TODO we might want to handle something here
        });
        const btnClose = dialog.find('.btn-default');
        const btnSave = dialog.find('.btn-primary');
        const modalConsole = dialog.find('#run-workflow-modal-console');
        /*btnClose.on('click', (event) => {
            //TODO do we even need this?
            // dialog.modal('hide');
        });*/
        /*btnSave.on('click', (event) => {
            console.log(this._resultHash);
            console.log(this._bc.getDownloadURL(this._resultHash));
        });*/

        //showing dialog
        dialog.modal('show');
        btnClose.hide();
        btnSave.hide();

        const eventFunction = (_clinet, event) => {
            const msg = JSON.parse(event.notification.message);
            // console.log(msg.message);
            if(msg.type === 'result') {
                this._resultHash = msg.hash;
                $(btnSave).attr('href',this._bc.getDownloadURL(msg.hash));
                btnSave.show();
            } else {
                console.log(this._AU.ansi_to_html(msg.message));
                const pElement = document.createElement('p');
                let innerText = this._AU.ansi_to_html(msg.message);
                //TODO unfortunately, we need to put line breaks and tabs manually
                innerText = innerText.replace(/\n/g,'<br/>').replace(/\t/g, '&nbsp;&nbsp;');
                pElement.innerHTML = innerText;
                modalConsole.append(pElement);
                modalConsole.scrollTop = modalConsole.scrollHeight;
            }
        };
        const finishedEventFunction = (_client, event) => {
            this._client.removeEventListener(this._client.CONSTANTS.PLUGIN_FINISHED, finishedEventFunction);
            this._client.removeEventListener(this._client.CONSTANTS.PLUGIN_NOTIFICATION, eventFunction);
            // this._dialog.modal('hide');
            
            // btnClose.prop("disabled", false);
            btnClose.show();
        };

        this._client.addEventListener(this._client.CONSTANTS.PLUGIN_NOTIFICATION, eventFunction);
        this._client.addEventListener(this._client.CONSTANTS.PLUGIN_FINISHED, finishedEventFunction);

        callback(globalConfig, pluginConfig, false); // Set third argument to true to store config in user.
    };

    return ConfigWidget;
});