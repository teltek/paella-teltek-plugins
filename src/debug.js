import {Paella, defaultLoadVideoManifestFunction, bindEvent, Events} from 'paella-core';

import getBasicPluginContext from 'paella-basic-plugins';
import getSlidePluginContext from 'paella-slide-plugins';
import getZoomPluginContext from 'paella-zoom-plugin';
import getUserTrackingPluginContext from 'paella-user-tracking';

import getTeltekPluginsContext from "./index";

let hasIntro = false;
let hasTail = false;
let introLoaded = false;
let tailLoaded = false;
let originalVideoLoaded = false;

const initParams = {
    loadVideoManifest: async (videoManifestUrl, config, player) => {
        const result = await defaultLoadVideoManifestFunction(videoManifestUrl, config, player);

        hasIntro = (typeof result.intro !== 'undefined');
        hasTail = (typeof result.tail !== 'undefined');

        if (hasIntro && !introLoaded) {
            videoManifestUrl = result.intro;
            return await defaultLoadVideoManifestFunction(videoManifestUrl, config, player);
        }

        if(originalVideoLoaded && hasTail && !tailLoaded) {
            videoManifestUrl = result.tail;
            tailLoaded = true;
            return await defaultLoadVideoManifestFunction(videoManifestUrl, config, player);
        }

        return result;
    },
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

paella.bindEvent(Events.ENDED, async () => {

    if (hasIntro && !introLoaded) {
        introLoaded = true;
        await paella.reload();
    }

    if(originalVideoLoaded && hasTail && !tailLoaded) {
        await paella.reload();
    }

    originalVideoLoaded = true;

}, false);
