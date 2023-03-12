export interface IPosition {
  x: number;
  y: number;
}

export default class Position implements IPosition {
  public readonly x: number;
  public readonly y: number;

  static fromPlainObj(obj: IPosition): Position {
    return new Position(obj.x, obj.y);
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public isEqual(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
