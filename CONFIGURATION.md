# paella-teltek-plugins

A set of plugins for Paella Player

## Usage

**Step 1:** Import the plugin context and add it to the Paella Player initialization parameters:

```javascript
...
import getTeltekPluginsContext from 'paella-teltek-plugins';

let paella = new Paella('player-container', {
    customPluginContext: [
        getTeltekPluginsContext()
    ]
});
...
```

**Step 2:** Configure the plugins you want to use in the paella player configuration.

```json
{
    "plugins": {
      ...
      "es.teltek.paella.playlistButtonPlugin": {
        "enabled": true,
        "side": "left",
        "order": 4
      },
      ... other plugin settings
    }
}
```

**Show list of plugins**

[PLUGINS.md](PLUGINS.md)

