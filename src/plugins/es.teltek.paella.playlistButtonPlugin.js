import {MenuButtonPlugin} from 'paella-core';

import playlistIcon from '../icons/photo.svg';

import "../css/playlistButton.css";

export default class PlaylistButtonPlugin extends MenuButtonPlugin {
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
        return await super.isEnabled();
    }

    async load(streamData) {
        this.icon = playlistIcon;
        console.log(this.player.videoManifest);
    }
}
