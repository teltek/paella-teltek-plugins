import PipButton from './plugins/es.teltek.paella.pipButtonPlugin';
import PlaylistButton from './plugins/es.teltek.paella.playlistButtonPlugin';
import LiveIndicatorButton from './plugins/es.teltek.paella.liveIndicatorButtonPlugin';
import BreaksPluginButton from './plugins/org.opencast.paella.breaksPlugin';
import ViewsPluginButton from './plugins/es.teltek.paella.viewsPlugin';

export default function getTeltekPluginsContext() {
    return require.context("./plugins", true, /\.js/)
}

export const PipButtonPlugin = PipButton
export const PlaylistButtonPlugin = PlaylistButton
export const LiveIndicatorPlugin = LiveIndicatorButton
export const BreaksPlugin = BreaksPluginButton
export const ViewsPlugin = ViewsPluginButton
