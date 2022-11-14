import {Paella, defaultLoadVideoManifestFunction, bindEvent, Events, utils} from 'paella-core';

import getBasicPluginContext from 'paella-basic-plugins';
import getSlidePluginContext from 'paella-slide-plugins';
import getZoomPluginContext from 'paella-zoom-plugin';
import getUserTrackingPluginContext from 'paella-user-tracking';
import { loadTrimming, setTrimming } from './js/TrimmingLoader';

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

function humanTimeToSeconds(humanTime) {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    const hoursRE = /([0-9]+)h/i.exec(humanTime);
    const minRE = /([0-9]+)m/i.exec(humanTime);
    const secRE = /([0-9]+)s/i.exec(humanTime);
    if (hoursRE) {
        hours = parseInt(hoursRE[1]) * 60 * 60;
    }
    if (minRE) {
        minutes = parseInt(minRE[1]) * 60;
    }
    if (secRE) {
        seconds = parseInt(secRE[1]);
    }
    return hours + minutes + seconds;
}

bindEvent(paella, Events.PLAYER_LOADED, async () => {
    // Enable trimming
    let trimmingData = await loadTrimming(paella, paella.videoId);
    // Check for trimming param in URL: ?trimming=1m2s;2m
    const trimming = utils.getHashParameter('trimming') || utils.getUrlParameter('trimming');
    if (trimming) {
        const trimmingSplit = trimming.split(';');
        if (trimmingSplit.length === 2) {
            const startTrimming = trimmingData.start + humanTimeToSeconds(trimmingSplit[0]);
            const endTrimming = Math.min(trimmingData.start + humanTimeToSeconds(trimmingSplit[1]), trimmingData.end);

            if (startTrimming < endTrimming && endTrimming > 0 && startTrimming >= 0) {
                trimmingData = {
                    start: startTrimming,
                    end: endTrimming,
                    enabled: true
                };
            }
        }
    }
    await setTrimming(paella, trimmingData);

    // Check time param in URL and seek:  ?time=1m2s
    const timeString = utils.getHashParameter('time') || utils.getUrlParameter('time');
    if (timeString) {
        const totalTime = humanTimeToSeconds(timeString);
        await paella.videoContainer.setCurrentTime(totalTime);
    }

    // Check captions param in URL:  ?captions  / ?captions=<lang>
    const captions = utils.getHashParameter('captions') || utils.getUrlParameter('captions');
    if (captions != null) {
        let captionsIndex = 0;
        if (captions !== '') {
            paella.captionsCanvas.captions.some((c, idx) => {
                if (c.language === captions) {
                    captionsIndex = idx;
                    return true;
                }
                return false;
            });
        }
        const captionSelected = paella?.captionsCanvas?.captions[captionsIndex];
        if (captionSelected) {
            paella.log.info(`Enabling captions: ${captionSelected?.label} (${captionSelected?.language})`);
            paella.captionsCanvas.enableCaptions({ index: captionsIndex });
        }
    }
});
