import FetchFromPDP_data from './FetchFromPDP.data.json';
import DockerPull_data from './DockerPull.data.json';
import DockerImage_data from './DockerImage.data.json';
import DockerFile_data from './DockerFile.data.json';
import GetFile_data from './GeFile.data.json';
import UnzipFile_data from './UnzipFile.data.json';
import SAMatlab_data from './SAMatlab.data.json';
import BuildDockerFromDir_data from './BuildDockerFromDir.data.json';

export default {
    FetchFromPDP: {
        data: FetchFromPDP_data,
        ui: {}
    },
    DockerPull: {
        data: DockerPull_data,
        ui: {}
    },
    DockerImage: {
        data: DockerImage_data,
        ui: {}
    },
    DockerFile: {
        data: DockerFile_data,
        ui: {}
    },
    GetFile: {
        data: GetFile_data,
        ui: {}
    },
    UnzipFile: {
        data: UnzipFile_data,
        ui: {}
    },
    SAMatlab: {
        data: SAMatlab_data,
        ui: {}
    },
    BuildDockerFromDir: {
        data: BuildDockerFromDir_data,
        ui: {}
    }
}