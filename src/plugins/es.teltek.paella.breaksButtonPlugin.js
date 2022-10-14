import {Events, bindEvent, ButtonPlugin} from 'paella-core';

import "../css/breaksButton.css";

const TIMEUPDATE_SECONDS_UPDATE = 0.250;

function buildBreaks() {

    let videoManifest = this.player.videoManifest;
    let maxDuration = videoManifest.metadata.duration;
    let breakEndTime = 0;
    let final_break = false;

    bindEvent(this.player, Events.TIMEUPDATE, async ({currentTime}) => {
        if (final_break) {
            final_break = false;
        }

        if (!final_break) {
            videoManifest.breaks.forEach(function (element) {
                let difference = element.start - currentTime;
                if ((difference > 0 && difference < TIMEUPDATE_SECONDS_UPDATE)) {
                    breakEndTime = element.end;
                }
                if (currentTime > element.start && currentTime < element.end && breakEndTime < maxDuration) {
                    breakEndTime = element.end;
                    if (element.end >= maxDuration) {
                        breakEndTime = maxDuration;
                    }
                }
            });
            if (breakEndTime !== 0) {
                if (breakEndTime >= maxDuration) {
                    final_break = true;
                    await this.player.stop();
                    await this.player.videoContainer.setCurrentTime(maxDuration);
                }
                await this.player.videoContainer.setCurrentTime(breakEndTime);
                breakEndTime = 0;
            }
        }
    });
}

export default class BreaksButtonPlugin extends ButtonPlugin {
    getAriaLabel() {
        return "Breaks button plugin";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    get className() {
        return "breaks-block";
    }

    async isEnabled() {
        let videoManifest = await this.player.videoManifest;

        return videoManifest.breaks !== undefined && videoManifest.breaks.length > 0;
    }

    async load() {
        buildBreaks.apply(this);
    }

}

