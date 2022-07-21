import {PluginModule} from "paella-core";
import packageData from "../../package.json";

export default class TeltekPluginsModule extends PluginModule {
    get moduleName() {
        return "paella-teltek-plugins";
    }

    get moduleVersion() {
        return packageData.version;
    }
}
