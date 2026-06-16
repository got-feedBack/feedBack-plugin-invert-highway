# Slopsmith Plugin: Invert Highway

A plugin for [Slopsmith](https://github.com/byrongamatos/slopsmith) that inverts the note highway, flipping the vertical stacking order of chord notes — just like the Invert Strings option in the chart.


## Features

- **Invert chord note order** — flips the vertical layout of chord notes on the highway
- **Player controls button** — toggle inversion directly from the player controls during playback
- **Settings toggle** — enable/disable from the Settings page
- **Synced state** — player button and settings checkbox stay in sync
- **Persistent** — your preference is saved and remembered across sessions


## Installation

```bash
cd /path/to/slopsmith/plugins
git clone https://github.com/masc0t/slopsmith-plugin-invert-highway.git invert_highway
docker compose restart
```

## How It Works

1. Open **Settings** and toggle **Invert Highway** on — or click the **Invert** button in the player controls during playback
2. Chord notes on the highway will now stack in reverse string order
3. The player button and settings checkbox stay in sync
4. The setting persists in your browser's localStorage

## Requirements

Requires Slopsmith with highway inversion support (`highway.setInverted` / `highway.getInverted` API).

## Other Plugins

- [Find More Songs](https://github.com/masc0t/slopsmith-plugin-find-more) — search CustomsForge for more songs by an artist
- [Virtual Capo](https://github.com/masc0t/slopsmith-plugin-midi-capo) — auto-send MIDI pitch shift to match each song's tuning during playback (amp modellers)

## License

MIT
