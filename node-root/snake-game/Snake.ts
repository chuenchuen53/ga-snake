import { Direction, SnakeAction } from "./typing";
import { oppositeDirection } from "./oppositeDirection";
import type Position from "./Position";
import type { IPosition } from "./Position";
import type { PositionAndDirection, NotNullPositionAndDirection } from "./typing";

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

interface DirectionDxDyMap {
  [Direction.UP]: { dx: number; dy: number };
  [Direction.DOWN]: { dx: number; dy: number };
  [Direction.LEFT]: { dx: number; dy: number };
  [Direction.RIGHT]: { dx: number; dy: number };
}

export interface ISnake {
  positions: IPosition[];
  direction: Direction;
  allPositions2D: IPosition[][];
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

  private static readonly directionDxDyMap: DirectionDxDyMap = {
    [Direction.UP]: { dx: 0, dy: -1 },
    [Direction.DOWN]: { dx: 0, dy: 1 },
    [Direction.LEFT]: { dx: -1, dy: 0 },
    [Direction.RIGHT]: { dx: 1, dy: 0 },
  };

  public direction: Direction;
  public readonly positions: Position[];
  public readonly allPositions2D: Position[][];

  constructor(positions: Position[], direction: Direction, allPositions2D: Position[][]) {
    this.positions = positions.slice();
    this.direction = direction;
    this.allPositions2D = allPositions2D;
  }

  public toPlainObject(): ISnake {
    return {
      positions: this.positions.map((position) => position.toPlainObject()),
      direction: this.direction,
      allPositions2D: this.allPositions2D.map((row) => row.map((position) => position.toPlainObject())),
    };
  }

  public toPlainObjectWithoutAllPositions2D(): ISnake {
    return {
      positions: this.positions.map((position) => position.toPlainObject()),
      direction: this.direction,
      allPositions2D: [],
    };
  }

  public get head(): Position {
    return this.positions[0];
  }

  public get tail(): Position {
    return this.positions[this.length - 1];
  }

  public get length(): number {
    return this.positions.length;
  }

  public positionInSnake(position: Position): boolean {
    return this.positions.some((x) => x.isEqual(position));
  }

  /**
   *
   * @param position new position of the head (assume this position is not the food position)
   * @returns true if the new position is occupied by the snake
   */
  public checkEatSelfAfterMove(position: Position): boolean {
    // ignore the tail as it will move
    return this.tail.isEqual(position) ? false : this.positionInSnake(position);
  }

  /**
   * return null position if snake will be out of bounds
   */
  public getHeadPositionAndDirectionAfterMoveBySnakeAction(action: SnakeAction): PositionAndDirection {
    const { x: x0, y: y0 } = this.head;
    const { direction, positionChange } = Snake.actionMap[this.direction][action];
    const { dx, dy } = positionChange;
    const position: Position | null = this.allPositions2D[y0 + dy]?.[x0 + dx] ?? null;
    return { position, direction };
  }

  public getHeadPositionAndDirectionAfterMoveByDirection(direction: Direction): PositionAndDirection {
    const { x: x0, y: y0 } = this.head;
    const { dx, dy } = Snake.directionDxDyMap[direction];
    const position: Position | null = this.allPositions2D[y0 + dy]?.[x0 + dx] ?? null;
    return { position, direction };
  }

  public move(direction: Direction): void {
    const positionAndDirection = this.getHeadPositionAndDirectionAfterMoveByDirectionWithCheckingEatSelfAndOutOfBound(direction);
    this.positions.unshift(positionAndDirection.position);
    this.positions.pop();
    this.direction = positionAndDirection.direction;
  }

  public moveWithFoodEaten(direction: Direction): void {
    const positionAndDirection = this.getHeadPositionAndDirectionAfterMoveByDirectionWithCheckingEatSelfAndOutOfBound(direction);
    this.positions.unshift(positionAndDirection.position);
    this.direction = positionAndDirection.direction;
  }

  private getHeadPositionAndDirectionAfterMoveByDirectionWithCheckingEatSelfAndOutOfBound(direction: Direction): NotNullPositionAndDirection {
    if (this.direction === oppositeDirection(direction)) throw new Error("snake cannot move to opposite direction");
    const positionAndDirection = this.getHeadPositionAndDirectionAfterMoveByDirection(direction);
    if (positionAndDirection.position === null) throw new Error("snake move will out of bound");
    return {
      position: positionAndDirection.position,
      direction: positionAndDirection.direction,
    };
  }
}
