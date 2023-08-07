import {Paella, defaultLoadVideoManifestFunction, bindEvent, Events, utils} from 'paella-core';

import getBasicPluginContext from 'paella-basic-plugins';
import getSlidePluginContext from 'paella-slide-plugins';
import getZoomPluginContext from 'paella-zoom-plugin';
import getUserTrackingPluginContext from 'paella-user-tracking';

import getTeltekPluginsContext from "./index";

// Customized icons
import fullscreenIcon from './icons/fullscreen.svg';
import windowedIcon from './icons/fullscreen.svg';
import captionsIcon from './icons/captions.svg';
import playIcon from './icons/play.svg';
import pauseIcon from './icons/pause.svg';
import volumeHighIcon from './icons/volume-high.svg';
import volumeLowIcon from './icons/volume-low.svg';
import volumeMidIcon from './icons/volume-mid.svg';
import volumeMuteIcon from './icons/volume-mute.svg';

import './css/custom_styles.css';

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

paella.loadManifest().then(() => {
    paella.addCustomPluginIcon("es.upv.paella.playPauseButton","play",playIcon);
    paella.addCustomPluginIcon("es.upv.paella.playPauseButton","pause",pauseIcon);
    paella.addCustomPluginIcon("es.upv.paella.fullscreenButton","fullscreenIcon",fullscreenIcon);
    paella.addCustomPluginIcon("es.upv.paella.fullscreenButton","windowedIcon",windowedIcon);
    paella.addCustomPluginIcon("es.upv.paella.captionsSelectorPlugin","captionsIcon",captionsIcon);
    paella.addCustomPluginIcon("es.upv.paella.volumeButtonPlugin","volumeHighIcon",volumeHighIcon);
    paella.addCustomPluginIcon("es.upv.paella.volumeButtonPlugin","volumeLowIcon",volumeLowIcon);
    paella.addCustomPluginIcon("es.upv.paella.volumeButtonPlugin","volumeMidIcon",volumeMidIcon);
    paella.addCustomPluginIcon("es.upv.paella.volumeButtonPlugin","volumeMuteIcon",volumeMuteIcon);
}).catch(e => console.error(e));

paella.bindEvent(Events.ENDED, async () => {
    if (hasIntro && !introLoaded) {
        introLoaded = true;
        await paella.reload();
        await paella.play();
    }

    if(originalVideoLoaded && hasTail && !tailLoaded) {
        await paella.reload();
        await paella.play();
    }

    originalVideoLoaded = true;

}, false);

bindEvent(paella, Events.PLAYER_LOADED, async () => {
    // Check time param in URL and seek: ?time=00:01:30
    const timeString = utils.getHashParameter('time') || utils.getUrlParameter('time');
    if (timeString) {
        const totalTime = utils.timeToSeconds(timeString);
        await paella.videoContainer.setCurrentTime(totalTime);
    }
});
