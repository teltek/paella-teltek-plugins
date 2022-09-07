import {Paella} from 'paella-core';

import getBasicPluginContext from 'paella-basic-plugins';
import getSlidePluginContext from 'paella-slide-plugins';
import getZoomPluginContext from 'paella-zoom-plugin';
import getUserTrackingPluginContext from 'paella-user-tracking';

import getTeltekPluginsContext from "./index";

const initParams = {
    customPluginContext: [
        getTeltekPluginsContext(),
        getBasicPluginContext(),
        getSlidePluginContext(),
        getZoomPluginContext(),
        getUserTrackingPluginContext()
    ]
};

let paella = new Paella('player-container', initParams);

paella.loadManifest().catch(e => console.error(e));
