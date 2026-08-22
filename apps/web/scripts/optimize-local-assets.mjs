import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const publicRoot = path.resolve('public');
const assetsRoot = path.join(publicRoot, 'assets');
const outputRoot = path.join(assetsRoot, 'optimized');
const rasterPattern = /\.(?:jpe?g|png)$/i;
const widths = [320, 640, 960, 1600];

async function collectRasterFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'optimized' || entry.name === 'fonts') continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectRasterFiles(absolutePath));
    if (entry.isFile() && rasterPattern.test(entry.name)) files.push(absolutePath);
  }

  return files;
}

function qualityFor(relativePath) {
  if (relativePath.startsWith('partners') || relativePath.startsWith('brand')) return 88;
  if (relativePath.startsWith('cases')) return 82;
  return 78;
}

async function optimize(sourcePath) {
  const relativePath = path.relative(assetsRoot, sourcePath);
  const stem = relativePath.replace(rasterPattern, '');
  const outputDirectory = path.join(outputRoot, path.dirname(stem));
  await mkdir(outputDirectory, { recursive: true });

  for (const width of widths) {
    const suffix = width === 1600 ? '' : `.w${width}`;
    const outputPath = path.join(outputRoot, `${stem}${suffix}.webp`);
    await sharp(sourcePath)
      .rotate()
      .resize({ width, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({
        quality: qualityFor(relativePath),
        alphaQuality: 96,
        effort: 5,
        smartSubsample: true,
      })
      .toFile(outputPath);
  }
}

const sourceFiles = await collectRasterFiles(assetsRoot);
for (const sourceFile of sourceFiles) await optimize(sourceFile);

await sharp(path.join(assetsRoot, 'brand', 'logo-nautica.png'))
  .resize({ width: 64, height: 64, fit: 'contain' })
  .png({ compressionLevel: 9, palette: true })
  .toFile(path.join(assetsRoot, 'brand', 'favicon.png'));

console.log(`Optimized ${sourceFiles.length} raster assets in WebP at 320, 640, 960 and 1600 px.`);
