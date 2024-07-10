/**
 * This is a frame in the json data.
 * It uses the generic TexturePacker format so it should be easy to use in other engines.
 */
export type Frame = {
  /**
   * The name you can use to get the frame.
   */
  filename: string;

  /**
   * The rectangle position and size of the frame in the atlas image.
   */
  frame: {
    /**
     * The x position in pixels.
     */
    x: number;

    /**
     * The y position in pixels.
     */
    y: number;

    /**
     * The width in pixels.
     */
    w: number;

    /**
     * The height in pixels.
     */
    h: number;
  };

  /**
   * This is always false because images are never stored rotated.
   */
  rotated: boolean;

  /**
   * Are the transparent parts of the image trimmed off.
   */
  trimmed: boolean;

  /**
   * The size before trimming.
   */
  spriteSourceSize: {
    /**
     * The trimmed x offset in pixels.
     */
    x: number;

    /**
     * The trimmed y offset in pixels.
     */
    y: number;

    /**
     * The untrimmed sprite width in pixels.
     */
    w: number;

    /**
     * The untrimmed sprite height in pixels.
     */
    h: number;
  };

  /**
   * The size before trimming.
   */
  sourceSize: {
    /**
     * The untrimmed sprite width in pixels.
     */
    w: number;

    /**
     * The untrimmed sprite height in pixels.
     */
    h: number;
  };
};
