# Zellij Switch

A fork of [zellij-switch](https://github.com/mostafaqanbaryan/zellij-switch) — a Zellij plugin for switching between sessions with optional working directory and layout parameters. Built as a WASM plugin for the [Zellij](https://zellij.dev/) terminal multiplexer.

This fork includes adjustments for my personal workflow. The plugin is invoked through Zellij's pipe mechanism and accepts session name, working directory, and layout as arguments.

## Usage

The plugin is invoked through Zellij's pipe mechanism:

```bash
zellij pipe --plugin https://github.com/mostafaqanbaryan/zellij-switch/releases/download/0.2.1/zellij-switch.wasm -- "--session zellij-session --cwd /home --layout default"
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
  inputs.zellij-switch.url = "github:mostafaqanbaryan/zellij-switch";
  nixpkgs.overlays = [ zellij-switch.overlays.default ];
}
```

Then add `zellij-switch` to your system packages.
