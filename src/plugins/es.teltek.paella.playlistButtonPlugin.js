import {Events, MenuButtonPlugin, bindEvent} from 'paella-core';

import playlistIcon from '../icons/video-playlist.svg';

import "../css/playlistButton.css";

export default class PlaylistButtonPlugin extends MenuButtonPlugin {

    async getMenu() {
        const videoManifest = await this.player.videoManifest;
        const items = [];
        videoManifest.playlist.videos.forEach(function (element) {
            items.push({id: element.videoURL, title: element.title, pos: element.pos});
        });

        return items;
    }

    getAriaLabel() {
        return "Video playlist";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    get className() {
        return "playlist-button";
    }

    async isEnabled() {
        if (!await super.isEnabled()) {
            return false;
        }

        let videoManifest = await this.player.videoManifest;
        return videoManifest.playlist !== undefined && videoManifest.playlist.videos && videoManifest.playlist.videos.length > 0;
    }

    async load() {
        this.icon = playlistIcon;

        let videoManifest = await this.player.videoManifest;

        bindEvent(this.player, Events.ENDED, () => {
            let newURL = goToNextVideo(videoManifest);
            if (newURL !== false) {
                window.location.href = newURL;
            }
        }, false);
    }

    async itemSelected(itemData) {
        window.location.href = itemData.id;
    }
}

function goToNextVideo(videoManifest) {

    let newURL = new URL(window.location.href);
    let searchParams = new URLSearchParams(newURL.search);

    let pos = searchParams.get('pos');
    if(pos === null) {
        pos = videoManifest.playlist.playlistPos;
    }
    let nextPos = parseInt(pos) + 1;

    if(videoManifest.playlist.videos.length > pos) {
        let nextVideo = videoManifest.playlist.videos.find(function(element) {
            return parseInt(element.pos) === nextPos;
        });

        return nextVideo.videoURL;
    }

    return false;
}

