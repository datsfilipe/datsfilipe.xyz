export interface Project {
  id: string;
  title: string;
  version: string;
  date: string;
  file: string;
  media?: {
    type: "image" | "video" | "cast";
    url: string;
    caption?: string;
  }[];
}

export const projects: Project[] = [
  {
    id: "trxsh",
    title: "Trxsh",
    version: "v1.1.0",
    date: "2026-03-07",
    file: "trxsh.md",
    media: [
      {
        type: "cast",
        url: "/projects/trxsh-demo.cast",
        caption: "Trxsh in action",
      },
    ],
  },
  {
    id: "nix-envs",
    title: "nix-envs",
    version: "ddd37af",
    date: "2026-03-07",
    file: "nix-envs.md",
  },
  {
    id: "zellij-switch",
    title: "Zellij Switch",
    version: "5ea4ec6 (fork)",
    date: "2026-03-07",
    file: "zellij-switch.md",
    media: [
      {
        type: "cast",
        url: "/projects/zellij-switch-demo.cast",
        caption: "Switching sessions with Zellij Switch",
      },
    ],
  },
  {
    id: "vesper-nvim",
    title: "Vesper.nvim",
    version: "1717b1a",
    date: "2026-03-07",
    file: "vesper-nvim.md",
    media: [
      {
        type: "image",
        url: "/projects/vesper-nvim-preview.png",
        caption: "Vesper color scheme in Neovim",
      },
    ],
  },
];
