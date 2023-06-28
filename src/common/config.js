define(['text!./pluginconf.json'], function (CONF) {

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

    return {
        getMyConfig: getMyConfig,
        getDashboardUrl: getDashboardUrl

    };
});