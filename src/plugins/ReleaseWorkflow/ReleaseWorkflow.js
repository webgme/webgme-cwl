/*globals define*/
/*eslint-env node, browser*/

/**
 * Generated by PluginGenerator 2.20.5 from webgme on Wed Aug 03 2022 22:39:37 GMT-0500 (Central Daylight Time).
 * A plugin that inherits from the PluginBase. To see source code documentation about available
 * properties and methods visit %host%/docs/source/PluginBase.html.
 */

 define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase',
    'q',
    'superagent'
], function (
    PluginConfig,
    pluginMetadata,
    PluginBase,
    Q,
    superagent) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);

    /**
     * Initializes a new instance of ReleaseWorkflow.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin ReleaseWorkflow.
     * @constructor
     */
    function ReleaseWorkflow() {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    }

    function makeid() {
        const length = 16;
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i += 1 ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
       return 'rel_' + result;
    }

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructure etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    ReleaseWorkflow.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    ReleaseWorkflow.prototype = Object.create(PluginBase.prototype);
    ReleaseWorkflow.prototype.constructor = ReleaseWorkflow;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(Error|null, plugin.PluginResult)} callback - the result callback
     */
    ReleaseWorkflow.prototype.main = function (callback) {
        const {core, logger, activeNode, project, result, commitHash} = this;
        const executionId = makeid();
        const saveDirectory = './OUTPUT/' + executionId;  //TODO how to properly set this and create a temporary directory
        const fs = require('fs').promises;
        const path = require('path');
        const currentConfig = this.getCurrentConfig();
        const workflowName = core.getAttribute(activeNode, 'name');
        // 87dc1607-5d63-4073-9424-720f86ecef43 - workflow process
        // const previousReleasePDP = core.getAttribute(nodeObject,'pdpId') || '98df2486-153f-4ce0-93bf-c06cdd94657a_1';
        // const previousVersion = core.getAttribute(nodeObject, 'version') || 0;
        // const previousIndexPDP = previousReleasePDP.split('_')[1]; //TODO proper index needed from get status or sg
        // console.log(this.currentHash, this.commitHash, this.branchHash);
        this.getUpcomingTag(currentConfig.isMajor)
        .then(tag => {
            return project.createTag(tag, commitHash);
        })
        .then(() => {return fs.mkdir(saveDirectory);})
        .then(() => {return fs.mkdir(saveDirectory+'/cwl');})
        .then(() => {return fs.mkdir(saveDirectory+'/cwl/cwl');})
        .then(() => {return fs.mkdir(saveDirectory+'/cwl/ds');})
        .then(() => {
            return this.invokePlugin('ExportWorkflow',{pluginConfig:{}});
        })
        .then(innerResult => {
            if(!innerResult.success || !innerResult.messages[0]) {
                throw new Error ('cannot get the exchange format of thw workflow!');
            }

            return fs.writeFile(
                saveDirectory+'/cwl/ds/' + workflowName + '.CWF',
                innerResult.messages[0].message,
                'utf8'
            );
        })
        .then(() => {
            return this.invokePlugin(
                'BuildWorkflow',
                {
                    pluginConfig:{
                        saveToDir:true,
                        savePath:saveDirectory + '/cwl/cwl'
                    }
                });
        })
        .then(innerResult => {
            // console.log(innerResult);
            if (!innerResult.success) {
                throw new Error('unable to generate the workflow artifacts!!');
            }
            const timeStamp = new Date();
            const releaseMetadata = {
                taxonomyVersion:{
                    id:"AllLeap+TaxonomyBootcamp",
                    branch:"master",
                    commit:"#a6ca25a503ed11f3c004c60b0308c4aab4293e65",
                    url:"wellcomewebgme.centralus.cloudapp.azure.com"
                },
                taxonomyTags:[
                    {
                        Workflow:{
                            type:{
                                value:currentConfig.workflowType
                            }
                        }
                    },
                    {
                        Workflow:{
                            source:{
                                url:project.projectId + '_@_' + commitHash
                            }
                        }
                    },
                    {
                        Base:{
                            uploadTime:{
                                value: timeStamp.toString()
                            }
                        }
                    }
                ]
            };
            return fs.writeFile(
                saveDirectory+'/metadata.json', 
                JSON.stringify(releaseMetadata)
            );

        })
        /*.then(() => {
            return fs.copyFile(path.join(path.normalize(path.join(saveDirectory,'../../src/common')),'.sample_cache.json'), path.join(saveDirectory,'._sample_cache.json'));
        })
        .then(()=> {
            return fs.writeFile(
                saveDirectory+'/release.sh', 
                'java -jar ../../src/common/leap_cli.jar push -d ./cwl -p 87dc1607-5d63-4073-9424-720f86ecef43 -f ./metadata.json'
            );
        })
        .then(() => {
            return fs.chmod(saveDirectory+'/release.sh',0o777);
        })*/
        .then(() => {
            console.log(path.normalize(path.join(saveDirectory,'metadata.json')));
            const spawndef = Q.defer();
            const { spawn } = require('node:child_process');
            // const pushing = spawn('./release.sh', [],{cwd:saveDirectory});
            const pushing = spawn('java',
                ['-jar',
                'leap_cli.jar',
                'upload', 
                '-d', 
                './' + executionId +'/cwl',
                '-p',
                '87dc1607-5d63-4073-9424-720f86ecef43',
                '-f',
                './' + executionId + '/metadata.json'],
                {cwd:path.normalize('OUTPUT')}
            );
            pushing.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            
            pushing.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                spawndef.reject('FAILED pushing to PDP!');
            });
            
            pushing.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                if (code === 0) {
                    spawndef.resolve(null);
                } else {
                    spawndef.reject('Failed uploading content!');
                }
            });
            return spawndef.promise;
        })
        /*.then(() => {
            //release via router
            // return superagent('GET','/routers/ufs/wf-release?' + saveDirectory);
            // console.log(Object.keys(superagent));
            // return superagent.get('/routers/ufs/wf-release');
            // console.log(Object.keys(this.blobClient));
            // console.log(this.blobClient.apiToken);
            // console.log(this.blobClient.webgmeToken);
            const webgme = require('webgme-engine');
            const path = require('path');
            // const gmeConfig = require(path.join(process.cwd(), 'config'));
            // return webgme.getGmeAuth(gmeConfig);
            console.log(process.cwd());
            return Q(null);
        })
        .then(gmeAuth=> {
            return Q(null);
        })*/
        .then((result) => {
            console.log(result);
            return fs.rm(saveDirectory, { recursive: true });
        })
        .then(() => {
            result.setSuccess(true);
            return callback(null, result);
        })
        .catch(e => {
            logger.error(e);
            return callback(e);
        });
    };

    ReleaseWorkflow.prototype.getUpcomingTag = function (isMajor) {
        //TODO - need to figure out proper versioning
        const {core, logger, activeNode, project, result} = this;
        const deferred = Q.defer();
        project.getTags()
        .then(tags => {
            // console.log(tags);
            const mytags = {};
            deferred.resolve(makeid());
        })
        .catch(deferred.reject);

        return deferred.promise;
    };

    ReleaseWorkflow.prototype.getInputDependency = function () {
        const deferred = Q.defer();
        const self = this;
        const logger = self.logger;
        const nodeObject = self.activeNode;
        const core = self.core;

        let result = '';

        //TODO: we need to refresh the metamodel so that we look for actual data input steps...
        const pullGuid = '9bc917d8-b5e3-3cd3-e17e-650bd3c2e695';
        const isNodePull = node => {
            let parent = node;
            while(parent !== null) {
                if (core.getGuid(parent) === pullGuid) {
                    return core.getAttribute(node, 'value');
                }
                parent = core.getParent(parent);
            }
            return null;
        };
        
        core.loadSubTree(nodeObject)
        .then(nodes => {
            nodes.forEach(node => {
                const id = isNodePull(node);
                if(id !== null) {
                    result = id;
                }
            });
            return deferred.resolve(result);
        })
        .catch(e => {
            logger.error(e);
            return deferred.reject(e);
        })

        return deferred.promise;
    };

    return ReleaseWorkflow;
});
