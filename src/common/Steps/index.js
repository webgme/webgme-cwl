define(['./ports', 
'./DockerPull', 
'./GetFile',
'./FetchFromPDP'
], function (
    ports, 
    DockerPull, 
    GetFile, 
    FetchFromPDP) {

    return {
        processInput: ports.processInput,
        processOutput: ports.processOutput,
        DockerPull: DockerPull,
        GetFile: GetFile,
        FetchFromPDP: FetchFromPDP
    };
});