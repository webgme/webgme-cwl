define(['./ports', './DockerPull'], function (ports, DockerPull) {

    return {
        processInput: ports.processInput,
        processOutput: ports.processOutput,
        DockerPull: DockerPull
    };
});