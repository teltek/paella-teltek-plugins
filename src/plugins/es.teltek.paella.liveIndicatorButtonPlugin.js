import {PopUpButtonPlugin, createElementWithHtmlText} from 'paella-core';

import "../css/liveIndicatorButton.css";

function buildDuration() {
    this.liveIndicatorContainer.innerHTML = "";
    const liveIndicatorBlock = createElementWithHtmlText(`
    <div class="live-indicator-block-parent">
      <span class="live-indicator">
          <i class="fa fa-circle blink" aria-hidden="true"></i>Live
      </span>
    </div>
    `, this.liveIndicatorContainer);

    this.liveIndicatorContainer.style.display = "inline-block";
}

export default class LiveIndicatorButton extends PopUpButtonPlugin {

    async getContent() {
        let videoManifest = await this.player.videoManifest;

        return createElementWithHtmlText("<p>" + videoManifest.metadata.title + "</p>");
    }

    get popUpType() {
        return "modal";
    }

    getAriaLabel() {
        return "Live streaming";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    get className() {
        return "live-indicator-block";
    }

    get liveIndicatorContainer() {
        return this.leftArea;
    }

    async isEnabled() {
        if (!await super.isEnabled()) {
            return false;
        }

        let videoManifest = await this.player.videoManifest;
        return videoManifest.metadata.isStreaming !== undefined && videoManifest.metadata.isStreaming === true;
    }

    async load() {
        buildDuration.apply(this);
    }
}
