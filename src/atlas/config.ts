/**
 * Configuration options that are read from the toml file.
 */
export type Config = {
  /**
   * The name of the image and data files.
   */
  name: string;

  /**
   * The folder to store the atlas in relative to the config file.
   */
  saveFolder: string;

  /**
   * An array of folders with images you want to add to the atlas relative to the config file. Not recursive.
   */
  folders?: string[];

  /**
   * An array of image files you want to add to the atlas relative to the config file.
   */
  files?: string[];

  /**
   * Should the transparent pixels around the images be removed where possible to save space in the atlas.
   */
  trimmed?: boolean;

  /**
   * The amount of pixels to extrude out from the edge of the images. This helps with flickering on the edge of sprites.
   * Especially in tilemaps.
   */
  extrude?: number;

  /**
   * The method to use for packing the sprites.
   * Options:
   * - optimal - The smallest atlas possible.
   * - basic - Sort alphabetically and just add them in the fastest way.
   */
  packMethod?: PackMethod;

  /**
   * Should the folder name be included in the name of the sprite in the data file.
   * For when you use duplicate names in separate folders.
   */
  folderInName?: boolean;

  /**
   * The maximum width of the atlas image in pixels.
   */
  maxWidth?: number;

  /**
   * The maximum height of the atlas image in pixels.
   */
  maxHeight?: number;

  /**
   * Export only the image file.
   */
  noData?: boolean;
};

/**
 * Helper to load the configs.
 */
export type AtlasConfig = {
  atlas: Config[];
};

/**
 * Packing options.
 * Basic tries one time to fit everything.
 * Optimal tries to fit the images in the smallest space.
 */
export type PackMethod = 'basic' | 'optimal';
