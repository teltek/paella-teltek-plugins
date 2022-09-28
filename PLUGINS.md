# Included plugins

### Integrated duration plugin

It allows adds timer on playback bar.

```json
{
  "es.teltek.paella.integratedDurationButtonPlugin": {
    "enabled": true,
    "side": "left",
    "order": 6
  }
}
```

**Exported as** `IntegratedDurationPlugin`.

### Live indicator plugin

Add in the middle of playback bar a simple text "Live" when source is a live.

```json
{
  "es.teltek.paella.liveIndicatorButtonPlugin": {
    "enabled": true,
    "side": "left",
    "order": 7
  }
}
```

**Exported as** `LiveIndicatorButton`.

### Pip button plugin

Allows you to generate a mini player positioned at the bottom right of the screen. It only activates and works with
monostream videos.

```json
{
  "es.teltek.paella.pipButtonPlugin": {
    "enabled": true,
    "side": "right",
    "order": 105
  }
}
```

**Exported as** `PipButtonPlugin`.

### Playlist button plugin

Allows you to view and move through the content of a playlist submitted in the videoManifest.

```json
{
  "es.teltek.paella.playlistButtonPlugin": {
    "enabled": true,
    "side": "left",
    "order": 4
  }
}
```

**Exported as** `PlaylistButtonPlugin`.

### Volume button plugin

Same functionality as the generic volume plugin but removing the slider hiding.

```json
{
  "es.teltek.paella.volumeButtonPlugin": {
    "enabled": true,
    "side": "left",
    "order": 5
  }
}
```

**Exported as** `VolumeButtonPlugin`.

# Other features

### Intro and tail videos

This repository have logic to show an intro video or tail video (or both) before and after the original video.

You can show this feature using "https://{IP}?id=introAndTail".

It works loading the original video manifest file with 2 new attributes called "intro" and "tail" which have the relative URL
repository of the intro video and tail video.

Example:

```
    "intro": "repository/intro/data.json",
    "tail": "repository/tail/data.json",
```
