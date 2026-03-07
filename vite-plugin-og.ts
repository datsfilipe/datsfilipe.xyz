import type { Plugin } from "vite";
import { Resvg } from "@resvg/resvg-js";
import { posts } from "./src/app/data/posts";
import { projects } from "./src/app/data/projects";

const WIDTH = 1200;
const HEIGHT = 630;
const BG = "#181818";
const WHITE = "#e8e8e8";
const BLUE = "#3e6cef";
const MUTED = "#525252";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function splitTextColors(text: string): { white: string; blue: string } {
  const mid = Math.ceil(text.length / 2);
  let splitAt = text.indexOf(" ", mid - 5);
  if (splitAt === -1 || splitAt > mid + 5) splitAt = mid;
  return {
    white: text.slice(0, splitAt),
    blue: text.slice(splitAt),
  };
}

function generateOgSvg(opts: {
  title: string;
  subtitle?: string;
  splitMode: "name" | "title";
}): string {
  const { title, subtitle, splitMode } = opts;
  const fontSize = splitMode === "name" ? 72 : title.length > 30 ? 48 : 56;
  const lineHeight = fontSize * 1.3;

  const layers: string[] = [];
  const offsets = [-2, -1, 0, 1, 2];
  const opacities = [0.04, 0.08, 1, 0.08, 0.04];
  const xShifts = [20, 10, 0, -10, -20];

  for (let i = 0; i < offsets.length; i++) {
    const y = HEIGHT / 2 - 20 + offsets[i] * lineHeight * 0.45;
    const x = WIDTH / 2 + xShifts[i];
    const opacity = opacities[i];

    if (splitMode === "name") {
      const parts = title.split(" ");
      const first = escapeXml(parts[0] || "");
      const rest = escapeXml(parts.slice(1).join(" "));
      layers.push(
        `<text x="${x}" y="${y}" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="${fontSize}" font-weight="600" opacity="${opacity}">` +
          `<tspan fill="${WHITE}">${first} </tspan>` +
          `<tspan fill="${BLUE}">${rest}</tspan>` +
          `</text>`,
      );
    } else {
      const { white, blue } = splitTextColors(title);
      layers.push(
        `<text x="${x}" y="${y}" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="${fontSize}" font-weight="600" opacity="${opacity}">` +
          `<tspan fill="${WHITE}">${escapeXml(white)}</tspan>` +
          `<tspan fill="${BLUE}">${escapeXml(blue)}</tspan>` +
          `</text>`,
      );
    }
  }

  let subtitleSvg = "";
  if (subtitle) {
    subtitleSvg = `<text x="${WIDTH / 2}" y="${HEIGHT / 2 + lineHeight * 1.1}" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="24" fill="${MUTED}">${escapeXml(subtitle)}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}" />
  ${layers.join("\n  ")}
  ${subtitleSvg}
  <text x="${WIDTH / 2}" y="${HEIGHT - 40}" text-anchor="middle" font-family="'IBM Plex Sans', sans-serif" font-size="18"><tspan fill="${WHITE}">datsfilipe</tspan><tspan fill="${BLUE}">.xyz</tspan></text>
</svg>`;
}

function svgToPng(svg: string): Buffer {
  const resvg = new Resvg(svg, {
    font: {
      loadSystemFonts: true,
    },
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}

interface OgEntry {
  path: string;
  svg: string;
}

function getAllOgEntries(): OgEntry[] {
  const entries: OgEntry[] = [];

  entries.push({
    path: "og-image.png",
    svg: generateOgSvg({ title: "Filipe Lima", splitMode: "name" }),
  });

  for (const post of posts) {
    entries.push({
      path: `og/blog/${post.id}.png`,
      svg: generateOgSvg({
        title: post.title,
        subtitle: post.date,
        splitMode: "title",
      }),
    });
  }

  for (const project of projects) {
    entries.push({
      path: `og/projects/${project.id}.png`,
      svg: generateOgSvg({
        title: project.title,
        subtitle: `${project.date}  ·  ${project.version}`,
        splitMode: "title",
      }),
    });
  }

  return entries;
}

export function ogPlugin(): Plugin {
  const cache = new Map<string, Buffer>();

  return {
    name: "vite-plugin-og",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.replace(/^\//, "") || "";
        const entry = getAllOgEntries().find((e) => e.path === url);
        if (!entry) return next();

        if (!cache.has(entry.path)) {
          cache.set(entry.path, svgToPng(entry.svg));
        }
        res.setHeader("Content-Type", "image/png");
        res.end(cache.get(entry.path));
      });
    },
    generateBundle() {
      for (const entry of getAllOgEntries()) {
        this.emitFile({
          type: "asset",
          fileName: entry.path,
          source: svgToPng(entry.svg),
        });
      }
    },
  };
}
