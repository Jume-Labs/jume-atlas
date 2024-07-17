/**
 * RGBA color class to make working with pixels easier.
 */
export class Color {
  /**
   * The red channel.
   */
  readonly red: number;

  /**
   * The green channel.
   */
  readonly green: number;

  /**
   * The blue channel.
   */
  readonly blue: number;

  /**
   * The alpha channel.
   */
  readonly alpha: number;

  /**
   * Create a new color instance.
   * @param red (0 - 255)
   * @param green (0 - 255)
   * @param blue (0 - 255)
   * @param alpha (0 - 255)
   */
  constructor(red: number, green: number, blue: number, alpha: number) {
    this.red = Math.floor(red);
    this.green = Math.floor(green);
    this.blue = Math.floor(blue);
    this.alpha = Math.floor(alpha);
  }

  /**
   * Compare 2 colors.
   * @param other The other color.
   * @returns True if the colors match.
   */
  equals(other: Color): boolean {
    return (
      this.red === other.red && this.green === other.green && this.blue === other.blue && this.alpha === other.alpha
    );
  }
}
