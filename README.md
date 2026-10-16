# pi-imgcat

Show images inline in the [pi](https://pi.dev) terminal.

<p align="center">
  <img src="https://cdn.jsdelivr.net/npm/pi-imgcat@0.3.6-1/media/screenshot.png" alt="pi-imgcat rendering charts inline in the pi terminal" width="600">
</p>

## Install

```powershell
pi install git:github.com/GelArria/pi-imgcat
# optional, for real Sixel in Windows Terminal:
Install-Module Sixel -Scope CurrentUser -Force
```

Or from npm:

```powershell
pi install npm:pi-imgcat
```

Then `/reload` in pi.

## Usage

```
/img <IMAGE_PATH>          # inline preview
/imgopen <IMAGE_PATH>      # inline preview + full resolution in the OS viewer
```

The `show_image` tool is also available to the LLM (with an `open: true` flag for full resolution). Accepts local paths, `http(s)://` URLs, and `data:` URIs. The image is also sent to the model, so you can ask about it.

## Rendering

| Terminal | How |
|---|---|
| iTerm2, Kitty, WezTerm, Ghostty | native inline image (~60 cells wide) |
| Windows Terminal (direct) | Sixel (needs the `Sixel` PowerShell module) |
| Multiplexers (Herdr, tmux) or anything else | ANSI half-blocks — plain text, works everywhere |

Over SSH from iTerm2, run `$env:PI_IMAGE_PROTOCOL='iterm2'` before `pi` (iTerm doesn't forward its session id).

## WSL2

When pi runs inside WSL2, image conversion invokes Windows `powershell.exe` via WSL interop. For Sixel rendering, install the `Sixel` PowerShell module on the Windows side (`Install-Module Sixel -Scope CurrentUser -Force`) and ensure `powershell.exe` is accessible from WSL. Local WSL image paths are translated with `wslpath` for Windows PowerShell. If Sixel is unavailable, rendering falls back to ANSI blocks (which do not require the `Sixel` module), then to a text label if block conversion also fails. Both image conversion levels require working PowerShell interop.

Sixel targets use terminal cell pixel dimensions when available (falling back to 9×18 for invalid values), preserve the source aspect ratio, and allow up to 220 columns of image pixels at cell resolution while capping height at 110 rows and either dimension at 2200 px. This improves photo detail without generating unbounded Sixel output.

No npm dependencies. Sixel helpers adapted from [pi-image-tools](https://github.com/MasuRii/pi-image-tools) (MIT). License: MIT.