/*globals define*/
/*eslint-env node, browser*/

/**
 * Generated by PluginGenerator 2.20.5 from webgme on Mon Mar 20 2023 10:19:41 GMT-0500 (Central Daylight Time).
 * A plugin that inherits from the PluginBase. To see source code documentation about available
 * properties and methods visit %host%/docs/source/PluginBase.html.
 */

define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase'
], function (
    PluginConfig,
    pluginMetadata,
    PluginBase) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);

    /**
     * Initializes a new instance of UpgradeCWLCore.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin UpgradeCWLCore.
     * @constructor
     */
    function UpgradeCWLCore() {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    }

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructure etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    UpgradeCWLCore.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    UpgradeCWLCore.prototype = Object.create(PluginBase.prototype);
    UpgradeCWLCore.prototype.constructor = UpgradeCWLCore;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(Error|null, plugin.PluginResult)} callback - the result callback
     */
    UpgradeCWLCore.prototype.main = function (callback) {
        // Use this to access core, project, result, logger etc from PluginBase.
        const self = this;

        // Using the logger.
        self.logger.debug('This is a debug message.');
        self.logger.info('This is an info message.');
        self.logger.warn('This is a warning message.');
        self.logger.error('This is an error message.');

        // Using the coreAPI to make changes.
        const nodeObject = self.activeNode;
        self.core.setAttribute(nodeObject, 'name', 'My new obj');
        self.core.setRegistry(nodeObject, 'position', {x: 70, y: 70});


        // This will save the changes. If you don't want to save;
        // exclude self.save and call callback directly from this scope.
        self.save('UpgradeCWLCore updated model.')
            .then(() => {
                self.result.setSuccess(true);
                callback(null, self.result);
            })
            .catch((err) => {
                // Result success is false at invocation.
                self.logger.error(err.stack);
                callback(err, self.result);
            });
    };

    return UpgradeCWLCore;
});