export interface IPosition {
  x: number;
  y: number;
}

export default class Position implements IPosition {
  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public static fromPlainObj(obj: IPosition): Position {
    return new Position(obj.x, obj.y);
  }

  protected _x: number;
  protected _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public toPlainObject(): IPosition {
    return { x: this._x, y: this._y };
  }

  public isEqual(other: Position): boolean {
    return this._x === other._x && this._y === other._y;
  }
}
