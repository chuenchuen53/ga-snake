import Position from "./Position";
import { Direction, SnakeAction } from "./typing";
import type { IPosition } from "./Position";

interface ActionMapSecondLayerObject {
  direction: Direction;
  positionChange: { dx: number; dy: number };
}

interface ActionMapFirstLayerObject {
  [SnakeAction.FRONT]: Readonly<ActionMapSecondLayerObject>;
  [SnakeAction.TURN_LEFT]: Readonly<ActionMapSecondLayerObject>;
  [SnakeAction.TURN_RIGHT]: Readonly<ActionMapSecondLayerObject>;
}

interface ActionMap {
  [Direction.UP]: Readonly<ActionMapFirstLayerObject>;
  [Direction.DOWN]: Readonly<ActionMapFirstLayerObject>;
  [Direction.LEFT]: Readonly<ActionMapFirstLayerObject>;
  [Direction.RIGHT]: Readonly<ActionMapFirstLayerObject>;
}

interface PositionAndDirection {
  position: Position;
  direction: Direction;
}

export interface ISnake {
  positions: IPosition[];
  direction: Direction;
}

export default class Snake implements ISnake {
  private static actionMap: ActionMap = {
    [Direction.UP]: {
      [SnakeAction.FRONT]: { direction: Direction.UP, positionChange: { dx: 0, dy: -1 } },
      [SnakeAction.TURN_LEFT]: { direction: Direction.LEFT, positionChange: { dx: -1, dy: 0 } },
      [SnakeAction.TURN_RIGHT]: { direction: Direction.RIGHT, positionChange: { dx: 1, dy: 0 } },
    },
    [Direction.DOWN]: {
      [SnakeAction.FRONT]: { direction: Direction.DOWN, positionChange: { dx: 0, dy: 1 } },
      [SnakeAction.TURN_LEFT]: { direction: Direction.RIGHT, positionChange: { dx: 1, dy: 0 } },
      [SnakeAction.TURN_RIGHT]: { direction: Direction.LEFT, positionChange: { dx: -1, dy: 0 } },
    },
    [Direction.LEFT]: {
      [SnakeAction.FRONT]: { direction: Direction.LEFT, positionChange: { dx: -1, dy: 0 } },
      [SnakeAction.TURN_LEFT]: { direction: Direction.DOWN, positionChange: { dx: 0, dy: 1 } },
      [SnakeAction.TURN_RIGHT]: { direction: Direction.UP, positionChange: { dx: 0, dy: -1 } },
    },
    [Direction.RIGHT]: {
      [SnakeAction.FRONT]: { direction: Direction.RIGHT, positionChange: { dx: 1, dy: 0 } },
      [SnakeAction.TURN_LEFT]: { direction: Direction.UP, positionChange: { dx: 0, dy: -1 } },
      [SnakeAction.TURN_RIGHT]: { direction: Direction.DOWN, positionChange: { dx: 0, dy: 1 } },
    },
  };

  public static fromPlainObj(obj: ISnake): Snake {
    return new Snake(obj.positions.map(Position.fromPlainObj), obj.direction);
  }

  private _positions: Position[];
  private _direction: Direction;

  constructor(positions: Position[], direction: Direction) {
    this._positions = positions.slice();
    this._direction = direction;
  }

  public get positions(): Position[] {
    return this._positions;
  }

  public get direction(): Direction {
    return this._direction;
  }
  private set direction(value: Direction) {
    this._direction = value;
  }

  public toPlainObject(): ISnake {
    return {
      positions: this.positions.map((position) => position.toPlainObject()),
      direction: this.direction,
    };
  }

  /**
   *
   * @param position new position of the head (assume this position is not the food position)
   * @returns true if the new position is occupied by the snake
   */
  public checkCollisionAfterMove(position: Position): boolean {
    // ignore the tail as it will move
    const lastIndex = this.positions.length - 1;
    if (this.positions[lastIndex].x === position.x && this.positions[lastIndex].y === position.y) {
      return false;
    }

    return this.positions.some(({ x, y }) => x === position.x && y === position.y);
  }

  public getHeadPositionAndDirectionAfterMove(action: SnakeAction): PositionAndDirection {
    const { x: x0, y: y0 } = this.positions[0];
    const { direction, positionChange } = Snake.actionMap[this.direction][action];
    const { dx, dy } = positionChange;
    const position = new Position(x0 + dx, y0 + dy);

    return { position, direction };
  }

  public move(positionAndDirection: PositionAndDirection): void {
    this.positions.unshift(positionAndDirection.position);
    this.positions.pop();
    this.direction = positionAndDirection.direction;
  }

  public moveWithFoodEaten(positionAndDirection: PositionAndDirection): void {
    this.positions.unshift(positionAndDirection.position);
    this.direction = positionAndDirection.direction;
  }
}
