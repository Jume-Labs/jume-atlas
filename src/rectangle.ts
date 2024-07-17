/**
 * Rectangle used to calculate packing.
 */
export class Rectangle {
  /**
   * Filename of the image this rectangle belongs to.
   */
  readonly name: string;

  /**
   * The x position of the rectangle in pixels.
   */
  x: number;

  /**
   * The y position of the rectangle in pixels.
   */
  y: number;

  /**
   * The width of the rectangle in pixels.
   */
  width: number;

  /**
   * The height of the rectangle in pixels.
   */
  height: number;

  /**
   * @param x
   * @param y
   * @param width
   * @param height
   * @param name Optional filename.
   */
  constructor(x: number, y: number, width: number, height: number, name = '') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name;
  }

  /**
   * Create a new instance with the values of this rectangle.
   * @returns The new rectangle.
   */
  clone(): Rectangle {
    return new Rectangle(this.x, this.y, this.width, this.height, this.name);
  }

  /**
   * Calculate the area of this rectangle.
   * @returns The area in pixels.
   */
  area(): number {
    return this.width * this.height;
  }
}
