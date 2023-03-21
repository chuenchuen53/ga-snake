export interface IPosition {
  x: number;
  y: number;
}

export default class Position implements IPosition {
  public static fromPlainObj(obj: IPosition): Position {
    return new Position(obj.x, obj.y);
  }

  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public toPlainObject(): IPosition {
    return { x: this.x, y: this.y };
  }

  public isEqual(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
