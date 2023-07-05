define(['text!./pluginconfig.json'], function (CONF) {

    let everyConfig = {};
    try {
        everyConfig = JSON.parse(CONF);
    } catch {
        //TODO
    }

    const getMyConfig = function(pluginName) {
        const resultConfig = {};
        Object.keys(everyConfig.common || {}).forEach(key => {
            resultConfig[key] = everyConfig.common[key];
        });
        Object.keys(everyConfig[pluginName] || {}).forEach(key => {
            resultConfig[key] = everyConfig[pluginName][key];
        });
        return resultConfig;
    };

    const getDashboardUrl = () => {

        try {
            let url = everyConfig.common.taxonomy.url + '/routers/Dashboard/';
            url += encodeURIComponent(everyConfig.common.taxonomy.id);
            url += '/branch/master/static/index.html';

            return url;
        } catch {
            return 'https://google.com';
        }
    };

    const getWorkflowSearchUrl = () => {
        try {
            let url = everyConfig.common.taxonomy.url + '/routers/Search/';
            url += encodeURIComponent(everyConfig.common.taxonomy.id);
            url += '/branch/master/';
            url += encodeURIComponent(everyConfig.common.workflowRepoPath);
            url += '/static/';

            return url;
        } catch {
            return 'https://google.com';
        }
    };

    const makeid = (prefix) => {
        const length = 16;
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i += 1 ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        prefix = prefix || 'rel_';

       return prefix + result;
    };

    const strToPDP = (text) => {
        const elements = text.split('_');
        const result = {process: null, index: null, version: null};

        result.process = elements[0];
        result.index = elements[1];
        result.version = elements[2];

        return result;
    };

    return {
        getMyConfig: getMyConfig,
        getDashboardUrl: getDashboardUrl,
        getWorkflowSearchUrl: getWorkflowSearchUrl,
        makeid: makeid,
        strToPDP: strToPDP
    };
});