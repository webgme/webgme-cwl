define([], function () {

    const getCwlFileName = function(guid) {
        return guid+'_step.cwl';
    };

    return {
        getCwlFileName: getCwlFileName
    };
});