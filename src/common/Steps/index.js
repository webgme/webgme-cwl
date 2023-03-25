define(['./ports', 
'./DockerPull',
'./DockerImage',
'./DockerFile', 
'./GetFile',
'./FetchFromPDP',
'./SAMatlab',
'./UnzipFile'
], function (
    ports, 
    DockerPull, 
    DockerImage,
    DockerFile,
    GetFile, 
    FetchFromPDP,
    SAMatlab,
    UnzipFile) {

    return {
        processInput: ports.processInput,
        processOutput: ports.processOutput,
        DockerPull: DockerPull,
        DockerImage: DockerImage,
        DockerFile: DockerFile,
        GetFile: GetFile,
        FetchFromPDP: FetchFromPDP,
        SAMatlab: SAMatlab,
        UnzipFile: UnzipFile
    };
});