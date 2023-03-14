import Position from "./Position";

export default class MutablePosition extends Position {
  constructor(x: number, y: number) {
    super(x, y);
  }

  public set x(value: number) {
    this._x = value;
  }

  public set y(value: number) {
    this._y = value;
  }
}
