# feedBack Plugin: Invert Highway

A plugin for [feedBack](https://github.com/got-feedback/feedback) that inverts the note highway, flipping the vertical stacking order of chord notes — just like the Invert Strings option in the chart.


## Features

- **Invert chord note order** — flips the vertical layout of chord notes on the highway
- **Player controls button** — toggle inversion directly from the player controls during playback
- **Settings toggle** — enable/disable from the Settings page
- **Synced state** — player button and settings checkbox stay in sync
- **Persistent** — your preference is saved and remembered across sessions


## Installation

```bash
cd /path/to/feedBack/plugins
git clone https://github.com/got-feedback/feedBack-plugin-invert-highway.git invert_highway
docker compose restart
```

Invert Highway is also bundled with the feedBack Desktop app.

## How It Works

1. Open **Settings → Graphics** and toggle **Invert Highway** on — or click the **Invert** button in the player controls during playback. In the v3 UI it sits in the **Plugin controls** popover on the player rail.
2. Chord notes on the highway will now stack in reverse string order
3. The player button and settings checkbox stay in sync
4. The setting persists in your browser's localStorage

## Requirements

Requires feedBack with highway inversion support (`highway.setInverted` / `highway.getInverted` API).

## Other Plugins


## License

MIT
