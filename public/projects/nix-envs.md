# nix-envs

A CLI tool for managing dynamic, stackable Nix development environments. It generates flakes in a local cache directory (`~/.cache/envs`) and links them via `direnv`, keeping project directories clean and free of Nix boilerplate.

Written in Go, nix-envs supports creating isolated environments for multiple language runtimes with pinned versions.

## Supported Templates

`nodejs`, `go`, `rust`, `python`, `bun`, `lua`, `nix`, `elixir`.

## Usage

Here are some examples of commands available through the CLI:

```bash
# Create environments with specific versions
nix-envs create nodejs 20.11.0
nix-envs create go 1.22
nix-envs create rust 1.75.0

# Manage environments
nix-envs edit nodejs     # open flake in $EDITOR
nix-envs delete nodejs   # remove env and clean .envrc
```

## Installation

Using Nix:

```bash
nix profile install github:datsfilipe/nix-envs
```

Or build manually:

```bash
git clone https://github.com/datsfilipe/nix-envs.git && cd nix-envs
go build -o nix-envs main.go && sudo mv nix-envs /usr/local/bin/
```
