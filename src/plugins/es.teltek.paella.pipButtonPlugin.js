import {ButtonPlugin} from 'paella-core';

import pipIcon from '../icons/pip.svg';

import "../css/pipButton.css";

export default class PipButtonPlugin extends ButtonPlugin {
    getAriaLabel() {
        return "Picture in picture mode";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    get className() {
        return "pip-block";
    }

    async isEnabled() {
        if (!await super.isEnabled()) {
            return false;
        }

        const video = document.body.getElementsByClassName('video-player');
        return video.length === 1;
    }

    async load() {
        this.icon = pipIcon;
    }

    async action() {
        const video = document.body.getElementsByClassName('video-player')[0];
        if (video.webkitSetPresentationMode) {
            if (video.webkitPresentationMode === "picture-in-picture") {
                video.webkitSetPresentationMode("inline");
            } else {
                video.webkitSetPresentationMode("picture-in-picture");
            }
        } else if ('pictureInPictureEnabled' in document) {
            console.log(video);
            if (video !== document.pictureInPictureElement) {
                video.requestPictureInPicture();
            } else {
                document.exitPictureInPicture();
            }
        }
    }
}
