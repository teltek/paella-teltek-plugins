import {ButtonPlugin, createElementWithHtmlText, Events, bindEvent, utils} from 'paella-core';

import "../css/integratedDurationButton.css";

function buildDuration() {
    this.durationContainer.innerHTML = "";
    const durationBlock = createElementWithHtmlText(`
        <div class="duration-block">
            <div class="duration-button">
            <span class="integrated-duration-current">00:00</span>&nbsp;/&nbsp;<span class="integrated-duration-total">00:00</span>
            </div>
        </div>`, this.durationContainer);

    this.durationContainer.style.display = "inline-block";

    bindEvent(this.player, Events.TIMEUPDATE, () => {
        this.updateTime();
    });
}

export default class IntegratedDurationButtonPlugin extends ButtonPlugin {
    getAriaLabel() {
        return "Duration";
    }

    getDescription() {
        return this.getAriaLabel();
    }

    get className() {
        return "duration-block";
    }

    async isEnabled() {
        return await super.isEnabled();
    }

    get durationContainer() {
        if (this.config.side === "left") {
            return this.rightArea;
        }
        return this.leftArea;
    }

    async load() {
        buildDuration.apply(this);
    }

    async updateTime() {
        const currentTime = await this.player.videoContainer.currentTime();
        const totalTime = await this.player.videoManifest.metadata.duration || 0;
        document.body.getElementsByClassName('integrated-duration-current')[0].innerHTML = utils.secondsToTime(currentTime);
        document.body.getElementsByClassName('integrated-duration-total')[0].innerHTML = utils.secondsToTime(totalTime);
    }
}
