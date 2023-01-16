define(['./ports', 
'./DockerPull',
'./DockerImage',
'./DockerFile', 
'./GetFile',
'./FetchFromPDP'
], function (
    ports, 
    DockerPull, 
    DockerImage,
    DockerFile,
    GetFile, 
    FetchFromPDP) {

    return {
        processInput: ports.processInput,
        processOutput: ports.processOutput,
        DockerPull: DockerPull,
        DockerImage: DockerImage,
        DockerFile: DockerFile,
        GetFile: GetFile,
        FetchFromPDP: FetchFromPDP
    };
});