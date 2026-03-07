# Trxsh

Trxsh is a command-line trash manager written in Go. It provides a safe alternative to `rm` by moving files to a designated trash directory instead of permanently deleting them, with support for listing, restoring, and cleaning up trashed files.

The project follows the [freedesktop.org trash specification](https://specifications.freedesktop.org/trash-spec/1.0/) and is available on the [AUR](https://aur.archlinux.org/packages/trxsh) for Arch Linux users, with NixOS support via a custom derivation.

## Features

- **Safe deletion** — moves files to trash instead of permanently removing them
- **Listing** — view all files currently in the trash
- **Restore** — recover files by ID or through an interactive fzf interface
- **Cleanup** — permanently delete trashed files, with an option to keep recent ones (`--days N`)
- **Directory sizes** — inspect how much space trashed directories occupy

## Usage

The following is the output from the help command:

```bash
Usage: trxsh [OPTIONS] [FILES]
Options:
  --fzf, -f        : Restore files using fzf
  --list, -l       : List files in trash
  --restore, -r ID : Restore file by ID
  --cleanup, -c    : Empty trash (use --days N to keep recent files)
  --dir-sizes, -s  : Show directory sizes
  --help, -h       : Show this help
```

## Installation

On Arch Linux via AUR:

```bash
yay -Syu trxsh
```

For NixOS, a custom derivation can be added to your configuration. See the [derivation example](https://github.com/datsfilipe/trxsh/blob/main/examples/derivation.nix) in the repository.
