# Vesper.nvim

A Neovim port of [Vesper](https://github.com/raunofreiberg/vesper), a VS Code color scheme designed by Rauno Freiberg. The theme emphasizes readability with a dark, warm-toned palette and subtle syntax differentiation.

## Installation

Add the plugin with your preferred package manager.

Using Lazy:

```lua
{ 'datsfilipe/vesper.nvim' }
```

Using Packer:

```lua
use 'datsfilipe/vesper.nvim'
```

## Configuration

The following shows the default configuration options:

```lua
require('vesper').setup({
    transparent = false,
    italics = {
        comments = true,
        keywords = true,
        functions = true,
        strings = true,
        variables = true,
    },
    overrides = {},
    palette_overrides = {}
})
```

The colorscheme can be activated with `vim.cmd.colorscheme('vesper')` or through the provided `colorscheme()` function.

### Bufferline Integration

For [bufferline.nvim](https://github.com/akinsho/bufferline.nvim) users, use the built-in highlights table:

```lua
require('bufferline').setup({
    highlights = require('vesper').bufferline.highlights,
})
```
