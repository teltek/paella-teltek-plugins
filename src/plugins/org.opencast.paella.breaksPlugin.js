/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * This code was getting from:
 * https://github.com/opencast/opencast/blob/r/12.x/modules/engage-paella-player-7/src/plugins/org.opencast.paella.breaksPlugin.js
 * https://github.com/opencast/opencast/blob/r/12.x/modules/engage-paella-player-7/src/js/BreaksLoader.js
 *
 */

import { EventLogPlugin, Events } from 'paella-core';

import '../css/BreaksPlugin.css';

/*export const loadBreaks = async (player, videoId) => {
    const breaks = [];

    const response = await fetch(`/annotation/annotations.json?episode=${videoId}` + '&type=paella%2Fbreaks&day=&limit=1&offset=0');
    if (response.ok) {
        try {
            const data = await response.json();
            const annotation = Array.isArray(data.annotations?.annotation) ?
                data.annotations?.annotation[0] : data.annotations?.annotation;
            JSON.parse(annotation.value).breaks.forEach(({id, e, s, text}) => {
                breaks.push({id, s, e, text});
            });
        }
        catch (e) {
            player.log.warn('Error loading breaks annotations');
        }
    }
    return breaks;
};*/


export const loadBreaks = async (player, videoId) => {
    const breaks = [];
    const videoManifest = await player.videoManifest;
    try {
        videoManifest.breaks.forEach(({e, s}) => {
            breaks.push({e, s});
        });
    }
    catch (e) {
        player.log.warn('Error loading breaks annotations');
    }
    return breaks;
};

export default class BreaksPlugin extends EventLogPlugin {
    async load() {
    }

    get events() {
        return [
            Events.PLAYER_LOADED,
            Events.TIMEUPDATE,
            Events.SEEK
        ];
    }

    async onEvent(evt,params) {
        const t = params?.currentTime || params.newTime;

        if (evt === Events.PLAYER_LOADED) {
            this._breaks = await loadBreaks(this.player, this.player.videoId);
            this._breaks.sort((a,b) => a.s - b.s);
        }
        else if (this._breaks && t) {
            if (evt === Events.TIMEUPDATE) {
                await this.checkTimeupdate(t);
            }
            else if (evt === Events.SEEK) {
                await this.checkSeek(t);
            }
        }
    }

    async checkTimeupdate(currentTime) {
        const currentBreak = this.currentBreak(currentTime);
        const paused = await this.player.paused();
        if (currentBreak && !paused) {
            await this.player.videoContainer.setCurrentTime(this.trimTime(currentBreak.e + 0.1));
        }
    }

    async checkSeek(currentTime) {
        const currentBreak = this.currentBreak(currentTime);
        const paused = await this.player.paused();
        this.clearPausedMessage();
        if (currentBreak && paused) {
            this.setPausedMessage(currentBreak.text);
        }
    }

    currentBreak(t) {
        t = this.untrimTime(t);
        return this._breaks.find(br => br.s <= t && br.e >= t);
    }

    untrimTime(t) {
        if(this.player.videoContainer.isTrimEnabled && this.player.videoContainer.trimStart > t) {
            return this.player.videoContainer.trimStart;
        } else {
            return t;
        }
        //return this.player.videoContainer.isTrimEnabled ?
        //    this.player.videoContainer.trimStart + t : t;
    }

    trimTime(t) {
        if(this.player.videoContainer.isTrimEnabled && this.player.videoContainer.trimEnd < t) {
            this.player.stop();
            return this.player.videoContainer.trimEnd;
        } else {
            return t;
        }
    }

    clearPausedMessage() {
    }

    setPausedMessage(text) {
    }
}
