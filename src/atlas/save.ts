import { writeFileSync } from 'fs';
import Path from 'path';
import { PNG } from 'pngjs';

import { Atlas } from './atlas.js';
import { Frame } from './frame.js';

/**
 * Save the atlas image to a png file.
 * @param name The name of the file.
 * @param saveFolder The folder to save to.
 * @param atlas The created atlas.
 */
export function saveAtlasImage(name: string, saveFolder: string, atlas: Atlas): void {
  const path = Path.join(saveFolder, `${name}.png`);
  if (atlas.packedImage) {
    const buffer = PNG.sync.write(atlas.packedImage.pngData, { colorType: 6 });
    writeFileSync(path, buffer);
  }
}

/**
 * Save the json data to a file.
 * @param name The name of the file.
 * @param saveFolder The folder to save to.
 * @param atlas created atlas.
 */
export function saveJsonData(name: string, saveFolder: string, atlas: Atlas): void {
  const frames: Frame[] = [];

  for (const rect of atlas.packedRects) {
    const image = atlas.images.get(rect.name);
    if (image) {
      frames.push({
        filename: rect.name,
        frame: {
          x: rect.x + Number(image.extrude),
          y: rect.y + Number(image.extrude),
          w: rect.width - Number(image.extrude) * 2,
          h: rect.height - Number(image.extrude) * 2,
        },
        rotated: false,
        trimmed: image.trimmed,
        spriteSourceSize: {
          x: image.sourceX,
          y: image.sourceY,
          w: image.sourceWidth,
          h: image.sourceHeight,
        },
        sourceSize: {
          w: image.sourceWidth,
          h: image.sourceHeight,
        },
      });
    }
  }

  const path = Path.join(saveFolder, `${name}.json`);
  const content = JSON.stringify({ frames: frames }, null, 2);
  writeFileSync(path, content);
}
