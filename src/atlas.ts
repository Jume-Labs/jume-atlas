import { existsSync, lstatSync, readdirSync } from 'fs';
import Path from 'path';
import { PNG } from 'pngjs';

import { Config } from './config.js';
import { Image } from './image.js';
import { Packer } from './packer.js';
import { Rectangle } from './rectangle.js';

/**
 * The sprite atlas class holds the image and position data of the individual sprites
 */
export class Atlas {
  /**
   * The final packed image.
   */
  packedImage: Image | undefined;

  /**
   * The final packed image positions inside the atlas.
   */
  packedRects: Rectangle[] = [];

  /**
   * The images that are in the atlas.
   */
  images = new Map<string, Image>();

  /**
   * The start rectangles.
   */
  rects: Rectangle[] = [];

  /**
   * The file paths to the images.
   */
  private imagePaths: ImagePath[] = [];

  /**
   * atlas.toml configuration.
   */
  private config: Config;

  /**
   * Used to don't pack if the constructor found issues.
   */
  private errorFound = false;

  /**
   * Create a new atlas instance.
   * @param config The toml config
   */
  constructor(config: Config) {
    this.config = config;

    // Get all the png images from the folders in the config. This is not recursive.
    if (config.folders) {
      for (const folder of config.folders) {
        const fullPath = Path.join(process.cwd(), folder);
        if (existsSync(fullPath) && lstatSync(fullPath).isDirectory()) {
          const paths = this.getAllImagesPathsFromFolder(fullPath);
          this.imagePaths = this.imagePaths.concat(paths);
        } else {
          process.stdout.write(`Error: folder ${fullPath} does not exist.\n`);
        }
      }
    }

    // Get all the png images from the files in the config.
    if (config.files) {
      for (const file of config.files) {
        const fullPath = Path.join(process.cwd(), file);
        const imagePath = this.getFullImagePath(fullPath);
        if (imagePath) {
          this.imagePaths.push(imagePath);
        }
      }
    }

    if (this.imagePaths.length === 0) {
      this.errorFound = true;
      process.stdout.write('No images to pack.\n');
      return;
    }

    let duplicates = false;
    const names: string[] = [];
    for (const path of this.imagePaths) {
      const name = config.folderInName ? `${path.folderName}_${path.fileName}` : path.fileName;

      // Check for duplicates.
      if (names.includes(name)) {
        duplicates = true;
        process.stdout.write(`Error: "${name}" already exists. Cannot have duplicate names.\n`);
        continue;
      } else {
        names.push(name);
      }

      // Load the image and create the rectangle.
      const image = Image.fromFile(path.fullPath, config.trimmed ?? true, config.extrude ?? 0);
      this.images.set(name, image);
      this.rects.push(new Rectangle(0, 0, image.width, image.height, name));
    }

    if (duplicates) {
      process.stdout.write('Error: Duplicate image names found. Try using the "folderInName" config option.\n');
      this.errorFound = true;
    }
  }

  /**
   * Pack all the images into one image.
   * @returns True if the packing was successful.
   */
  pack(): boolean {
    if (this.errorFound) {
      return false;
    }
    // This does the actual packing.
    const packer = new Packer(
      this.rects,
      this.config.packMethod ?? 'optimal',
      this.config.maxWidth ?? 4096,
      this.config.maxHeight ?? 4096
    );

    if (!packer.pack()) {
      return false;
    }

    if (!packer.smallestBounds) {
      return false;
    }

    // Create the final blank image with the correct size.
    this.packedImage = new Image(packer.smallestBounds.width, packer.smallestBounds.height);

    // Add all images into the final image.
    for (const rect of packer.smallestLayout) {
      const img = this.images.get(rect.name);
      if (img) {
        PNG.bitblt(img.pngData, this.packedImage.pngData, 0, 0, img.width, img.height, rect.x, rect.y);
      }
    }
    this.packedRects = packer.smallestLayout;

    process.stdout.write(`Atlas "${this.config.name}" has been packed.\n`);

    return true;
  }

  /**
   * Loop through a folder and get all png paths. This is not recursive.
   * @param path
   * @returns A list of paths.
   */
  private getAllImagesPathsFromFolder(path: string): ImagePath[] {
    const imagePaths: ImagePath[] = [];
    for (const file of readdirSync(path)) {
      const fullPath = Path.join(path, file);
      if (lstatSync(fullPath).isFile()) {
        const imagePath = this.getFullImagePath(fullPath);
        if (imagePath) {
          imagePaths.push(imagePath);
        }
      }
    }

    return imagePaths;
  }

  /**
   * Create a path with direct parent folder name and a file name for easy use later.
   * @param path
   * @returns The created full ImagePath or null if it is not a .png.
   */
  private getFullImagePath(path: string): ImagePath | null {
    if (Path.extname(path) === '.png') {
      const folders = Path.dirname(path).split(Path.sep);
      const folder = folders[folders.length - 1];

      return {
        fullPath: path,
        folderName: folder,
        fileName: Path.basename(path, Path.extname(path)),
      };
    } else {
      process.stdout.write(`${path} is not a png image.\n`);

      return null;
    }
  }
}

/**
 * Helper type that stores the direct parent folder name,
 * the file name without extension and the full path of an image.
 */
export type ImagePath = {
  folderName: string;
  fileName: string;
  fullPath: string;
};
