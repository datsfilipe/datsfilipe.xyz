# Zellij Switch

A fork of [zellij-switch](https://github.com/mostafaqanbaryan/zellij-switch) — a Zellij plugin for switching between sessions with optional working directory and layout parameters. Built as a WASM plugin for the [Zellij](https://zellij.dev/) terminal multiplexer.

This fork makes the plugin track active sessions and enforce alphabetical ordering to ensure stable switching indices. It also simplifies the local setup by having the plugin do some of the job instead of maintaining multiple shell scripts to interact with it.

## Usage

Sessionsizer basic setup guide.

### Plugin Configuration

On your Zellij configuration file:

```kdl
plugins {
    zellij-switch location="file:///plugin/path/zellij-switch.wasm" {
        _internal_ "true"
        name "zellij-switch"
    }
}

load_plugins {
    "zellij-switch"
}
```

### Keybindings

Switch between your first 10 active sessions:

```kdl
bind "Alt 0" { MessagePlugin "zellij-switch" { payload "session-index 0"; }; }
bind "Alt 1" { MessagePlugin "zellij-switch" { payload "session-index 1"; }; }
// ... repeat for 2-9
```

Scan directories for git folders, open a floating pane with `fzf`, and create/switch to a session for the selected location:

```kdl
bind "Ctrl f" {
  Run "bash" "-c" "find ~/src ~/org -maxdepth 5 -name .git | xargs -I{} dirname {} | sort -u | while read -r p; do if [ -f \"$p/.git\" ]; then printf \"%s_%s\t%s\n\" \"$(basename \"$(dirname \"$p\")\")\" \"$(basename \"$p\")\" \"$p\"; else printf \"%s\t%s\n\" \"$(basename \"$p\")\" \"$p\"; fi; done | column -t -s $'\t' | fzf --layout=reverse --header='Select Project' --nth=1 | awk '{print $1, $2}' | xargs -n2 bash -c 'name=$0; cwd=$1; s=$(zellij ls -s 2>/dev/null | grep -E \"(-|^)${name}$\" | head -n1); if [ -z \"$s\" ]; then s=\"$(date +%s)-$name\"; fi; zellij pipe --name zellij-switch -- \"session-select --target $s --cwd $cwd\"'" {
      floating true
      close_on_exit true
      width "70%"
      height "70%"
      x "15%"
      y "15%"
  }
}
```

The plugin sorts sessions alphabetically, but prepending a timestamp ensures creation order is preserved.

### Window Manager Integration

For opening the terminal together with a default session (e.g. via Niri keymap):

```bash
Mod+Return {
  spawn "bash" "-c" "t='dtsf'; s=$(zellij ls -s 2>/dev/null | grep -E \"(-|^)${t}$\" | sort | head -n1); if [ -n \"$s\" ]; then alacritty -e zellij attach \"$s\"; else alacritty -e zellij attach -c \"$(date +%s)-$t\"; fi"
}
```

### Parameters

- `-s|--session` — target session name (supports spaces as of v0.2.1)
- `-c|--cwd` — absolute path to set as working directory (optional)
- `-l|--layout` — Zellij layout to use (optional)

## Building from Source

Clone the repository and compile the WASM target:

```bash
cargo build --target wasm32-wasip1 --release
```

## NixOS Installation

Add the flake as an input and use the provided overlay:

```nix
{
  inputs.zellij-switch.url = "github:datsfilipe/zellij-switch";
  nixpkgs.overlays = [ zellij-switch.overlays.default ];
}
```

Then add `zellij-switch` to your system packages.
