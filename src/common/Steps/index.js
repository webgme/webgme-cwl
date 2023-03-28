define(['./ports', 
'./DockerPull',
'./DockerImage',
'./DockerFile', 
'./GetFile',
'./FetchFromPDP',
'./SAMatlab',
'./UnzipFile',
'./BuildDockerFromDir'
], function (
    ports, 
    DockerPull, 
    DockerImage,
    DockerFile,
    GetFile, 
    FetchFromPDP,
    SAMatlab,
    UnzipFile,
    BuildDockerFromDir) {

    return {
        processInput: ports.processInput,
        processOutput: ports.processOutput,
        DockerPull: DockerPull,
        DockerImage: DockerImage,
        DockerFile: DockerFile,
        GetFile: GetFile,
        FetchFromPDP: FetchFromPDP,
        SAMatlab: SAMatlab,
        UnzipFile: UnzipFile,
        BuildDockerFromDir: BuildDockerFromDir
    };
});