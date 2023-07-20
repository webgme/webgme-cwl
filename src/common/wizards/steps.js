import FetchFromPDP_data from './FetchFromPDP_data.json';
import FetchFromPDP_ui from './FetchFromPDP_ui.json';
export default {
    FetchFromPDP: {
        data: FetchFromPDP_data,
        ui: FetchFromPDP_ui,
        prepare: (context) => {return FetchFromPDP_data}
    }
}