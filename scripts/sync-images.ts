import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content");
const OUTPUT_ROOT = path.join(ROOT, "public");
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".svg", ".gif", ".webp"]);

interface Stats {
  copied: number;
  skipped: number;
  pruned: number;
}

function needsCopy(srcPath: string, outPath: string): boolean {
  if (!fs.existsSync(outPath)) return true;
  const src = fs.statSync(srcPath);
  const out = fs.statSync(outPath);
  return src.mtimeMs > out.mtimeMs || src.size !== out.size;
}

function syncFolder(dir: string, segments: string[], stats: Stats) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const imageFiles = entries.filter(
    (e) => e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase())
  );
  const subdirs = entries.filter((e) => e.isDirectory());
  const outDir = path.join(OUTPUT_ROOT, ...segments);

  if (imageFiles.length > 0) {
    fs.mkdirSync(outDir, { recursive: true });

    for (const file of imageFiles) {
      const srcPath = path.join(dir, file.name);
      const outPath = path.join(outDir, file.name);

      if (!needsCopy(srcPath, outPath)) {
        stats.skipped++;
        continue;
      }

      fs.copyFileSync(srcPath, outPath);
      stats.copied++;
      console.log(`synced   ${path.relative(ROOT, srcPath)} -> ${path.relative(ROOT, outPath)}`);
    }
  }
  if (fs.existsSync(outDir)) {
    const sourceNames = new Set(imageFiles.map((f) => f.name));
    for (const entry of fs.readdirSync(outDir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (!IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) continue;
      if (sourceNames.has(entry.name)) continue;
      fs.unlinkSync(path.join(outDir, entry.name));
      stats.pruned++;
      console.log(`pruned   ${path.relative(ROOT, path.join(outDir, entry.name))}`);
    }
  }

  for (const sub of subdirs) {
    syncFolder(path.join(dir, sub.name), [...segments, sub.name], stats);
  }
}

function run() {
  if (!fs.existsSync(CONTENT_ROOT)) {
    console.log("no content/ directory found — nothing to sync.");
    return;
  }

  const stats: Stats = { copied: 0, skipped: 0, pruned: 0 };
  syncFolder(CONTENT_ROOT, [], stats);

  console.log(`\ndone. copied=${stats.copied} skipped=${stats.skipped} pruned=${stats.pruned}`);
}

run();
