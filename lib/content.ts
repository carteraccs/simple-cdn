import fs from "node:fs";
import path from "node:path";

export interface Manifest {
  title: string;
  description?: string;
  [key: string]: unknown;
}

export interface ContentChild {
  slug: string;
  title: string;
}

export interface Asset {
  name: string;
  svgUrl: string | null;
  imageUrl: string | null;
}

export interface ContentNode {
  segments: string[];
  title: string;
  description?: string;
  manifest: Manifest | null;
  assets: Asset[];
  children: ContentChild[];
}

const CONTENT_ROOT = path.join(process.cwd(), "content");
const ASSET_ROOT = path.join(process.cwd(), "public");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"]);

function isImageFile(filename: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

// Validate URL segments before resolving paths under content/.
function isSafeSegments(segments: string[]): boolean {
  return segments.every(
    (s) => s.length > 0 && s !== "." && s !== ".." && !s.includes("/") && !s.includes("\\")
  );
}

function titleCase(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function readManifestAt(dir: string): Manifest | null {
  const manifestPath = path.join(dir, "manifest.json");
  if (!fs.existsSync(manifestPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Manifest;
  } catch {
    return null;
  }
}

export function getContentNode(segments: string[]): ContentNode | null {
  if (!isSafeSegments(segments)) return null;

  const dir = path.join(CONTENT_ROOT, ...segments);
  if (!dir.startsWith(CONTENT_ROOT + path.sep) && dir !== CONTENT_ROOT) return null;
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;

  const manifest = readManifestAt(dir);

  const children: ContentChild[] = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const childManifest = readManifestAt(path.join(dir, entry.name));
      return { slug: entry.name, title: childManifest?.title ?? titleCase(entry.name) };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  const assetDir = path.join(ASSET_ROOT, ...segments);
  const assets: Asset[] = [];
  if (fs.existsSync(assetDir)) {
    const byName = new Map<string, Asset>();
    const files = fs
      .readdirSync(assetDir)
      .filter((file) => file.toLowerCase().endsWith(".svg") || isImageFile(file))
      .sort();

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const name = path.basename(file, ext);
      const url = `/${[...segments, file].join("/")}`;
      const existing = byName.get(name) ?? { name, svgUrl: null, imageUrl: null };
      if (ext === ".svg") existing.svgUrl = url;
      else existing.imageUrl = url;
      byName.set(name, existing);
    }

    assets.push(...Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name)));
  }

  const lastSegment = segments[segments.length - 1];
  return {
    segments,
    title: manifest?.title ?? (lastSegment ? titleCase(lastSegment) : "Home"),
    description: manifest?.description ? String(manifest.description) : undefined,
    manifest,
    assets,
    children,
  };
}

export function listAllContentPaths(): string[][] {
  const results: string[][] = [];

  function walk(dir: string, segments: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const nextSegments = [...segments, entry.name];
      results.push(nextSegments);
      walk(path.join(dir, entry.name), nextSegments);
    }
  }

  if (fs.existsSync(CONTENT_ROOT)) walk(CONTENT_ROOT, []);
  return results;
}
