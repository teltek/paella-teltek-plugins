import { EventLogPlugin, Events } from 'paella-core';
export default class ViewsPlugin extends EventLogPlugin {
    async load() {
    }

    get events() {
        return [
            Events.PLAYER_LOADED
        ];
    }

    async onEvent(evt,params) {
        let manifest = await this.player.videoManifest;
        await fetch('/mediaplayed/' + manifest.metadata.id);
    }
}
