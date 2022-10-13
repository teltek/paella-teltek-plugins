import IntegratedDuration from './plugins/es.teltek.paella.integratedDurationButtonPlugin';
import PipButton from './plugins/es.teltek.paella.pipButtonPlugin';
import PlaylistButton from './plugins/es.teltek.paella.playlistButtonPlugin';
import VolumeButton from './plugins/es.teltek.paella.volumeButtonPlugin';
import LiveIndicatorButton from './plugins/es.teltek.paella.liveIndicatorButtonPlugin';
import BreaksButton from './plugins/es.teltek.paella.breaksButtonPlugin';

export default function getTeltekPluginsContext() {
    return require.context("./plugins", true, /\.js/)
}

export const IntegratedDurationPlugin = IntegratedDuration
export const PipButtonPlugin = PipButton
export const PlaylistButtonPlugin = PlaylistButton
export const VolumeButtonPlugin = VolumeButton
export const LiveIndicatorPlugin = LiveIndicatorButton
export const BreaksButtonPlugin = BreaksButton
