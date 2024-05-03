import Position from "./Position";
import Snake from "./Snake";
import { Direction } from "./typing";
import Utils from "./Utils";
import { oppositeDirection } from "./oppositeDirection";
import type { PositionAndDirection, SnakeAction } from "./typing";
import type { ISnake } from "./Snake";
import type { IPosition } from "./Position";

export interface GameRecord {
  worldWidth: number;
  worldHeight: number;
  initialSnakePosition: IPosition;
  initialSnakeDirection: Direction;
  initialFoodPosition: IPosition;
  /**
   * 0 -> up, 1 -> down, 2 -> left, 3 -> right
   * if no eat food, the snake will be direction
   * if eat food, the snake will be ( new food index in 1d + 1 ) * 10 + direction
   * */
  moveRecord: number[];
}

export interface ProvidedInitialStatus {
  snake: Omit<ISnake, "allPositions2D">;
  food: IPosition;
  gameOver: boolean;
  moves: number;
  movesForNoFood: number;
  initialSnakePosition: IPosition;
  initialSnakeDirection: Direction;
  initialFoodPosition: IPosition;
  moveRecord: number[];
}

export interface Options {
  worldWidth: number;
  worldHeight: number;
  providedInitialStatus?: ProvidedInitialStatus;
}

export interface ISnakeGame {
  worldWidth: number;
  worldHeight: number;
  allPositions: IPosition[];
  allPositions2D: IPosition[][];
  snake: ISnake;
  food: IPosition;
  gameOver: boolean;
  moves: number;
  movesForNoFood: number;
  maxMovesOfNoFood: number;
  initialSnakePosition: IPosition;
  initialSnakeDirection: Direction;
  initialFoodPosition: IPosition;
  moveRecord: number[];
}

export default class SnakeGame implements ISnakeGame {
  public static directionMap = {
    [Direction.UP]: 0,
    [Direction.DOWN]: 1,
    [Direction.LEFT]: 2,
    [Direction.RIGHT]: 3,
  } satisfies Record<Direction, number>;

  public static inverseDirectionMap = {
    0: Direction.UP,
    1: Direction.DOWN,
    2: Direction.LEFT,
    3: Direction.RIGHT,
  } satisfies Record<number, Direction>;

  public static cloneGameRecord(gameRecord: GameRecord): GameRecord {
    return {
      worldWidth: gameRecord.worldWidth,
      worldHeight: gameRecord.worldHeight,
      initialSnakePosition: { ...gameRecord.initialSnakePosition },
      initialSnakeDirection: gameRecord.initialSnakeDirection,
      initialFoodPosition: { ...gameRecord.initialFoodPosition },
      moveRecord: gameRecord.moveRecord.slice(),
    };
  }

  public worldWidth: number;
  public worldHeight: number;
  public allPositions: Position[];
  public allPositions2D: Position[][];
  public snake: Snake;
  public food: Position;
  public gameOver: boolean;
  public moves: number;
  public movesForNoFood: number;
  public maxMovesOfNoFood: number;
  public initialSnakePosition: IPosition;
  public initialSnakeDirection: Direction;
  public initialFoodPosition: IPosition;
  public moveRecord: number[];

  constructor(options: Options) {
    this.worldWidth = options.worldWidth;
    this.worldHeight = options.worldHeight;

    this.allPositions = new Array(this.worldWidth * this.worldHeight);
    this.allPositions2D = new Array(this.worldHeight);

    for (let y = 0; y < this.worldHeight; y++) {
      this.allPositions2D[y] = new Array(this.worldWidth);
      for (let x = 0; x < this.worldWidth; x++) {
        const position = new Position(x, y);
        this.allPositions[y * this.worldWidth + x] = position;
        this.allPositions2D[y][x] = position;
      }
    }

    if (options.providedInitialStatus) {
      this.snake = this.getInitSnakeWithProvidedPositionAndDirection(options.providedInitialStatus.snake.positions, options.providedInitialStatus.snake.direction);
      this.food = Position.fromPlainObj(options.providedInitialStatus.food);
      this.gameOver = options.providedInitialStatus.gameOver;
      this.moves = options.providedInitialStatus.moves;
      this.movesForNoFood = options.providedInitialStatus.movesForNoFood;
      this.maxMovesOfNoFood = 0;
      this.initialSnakePosition = { ...options.providedInitialStatus.initialSnakePosition };
      this.initialSnakeDirection = options.providedInitialStatus.initialSnakeDirection;
      this.initialFoodPosition = { ...options.providedInitialStatus.initialFoodPosition };
      this.moveRecord = options.providedInitialStatus.moveRecord.slice();
    } else {
      this.snake = this.getInitSnake();
      this.food = this.getRandomFoodPosition();
      this.gameOver = false;
      this.moves = 0;
      this.movesForNoFood = 0;
      this.maxMovesOfNoFood = 0;
      this.initialSnakePosition = this.snake.head.toPlainObject();
      this.initialSnakeDirection = this.snake.direction;
      this.initialFoodPosition = this.food.toPlainObject();
      this.moveRecord = [];
    }

    this.updateMaxTurnOfNoFood();
  }

  public toPlainObject(): ISnakeGame {
    return {
      worldWidth: this.worldWidth,
      worldHeight: this.worldHeight,
      allPositions: this.allPositions.map((position) => position.toPlainObject()),
      allPositions2D: this.allPositions2D.map((row) => row.map((position) => position.toPlainObject())),
      snake: this.snake.toPlainObject(),
      food: this.food.toPlainObject(),
      gameOver: this.gameOver,
      moves: this.moves,
      movesForNoFood: this.movesForNoFood,
      maxMovesOfNoFood: this.maxMovesOfNoFood,
      initialSnakePosition: { ...this.initialSnakePosition },
      initialSnakeDirection: this.initialSnakeDirection,
      initialFoodPosition: { ...this.initialFoodPosition },
      moveRecord: this.moveRecord.slice(),
    };
  }

  public toPlainObjectIgnoreMoveRecordAndAllPosition(): ISnakeGame {
    return {
      worldWidth: this.worldWidth,
      worldHeight: this.worldHeight,
      allPositions: [],
      allPositions2D: [],
      snake: this.snake.toPlainObjectWithoutAllPositions2D(),
      food: this.food.toPlainObject(),
      gameOver: this.gameOver,
      moves: this.moves,
      movesForNoFood: this.movesForNoFood,
      maxMovesOfNoFood: this.maxMovesOfNoFood,
      initialSnakePosition: { ...this.initialSnakePosition },
      initialSnakeDirection: this.initialSnakeDirection,
      initialFoodPosition: { ...this.initialFoodPosition },
      moveRecord: [],
    };
  }

  public exportGameRecord(): GameRecord {
    return {
      worldWidth: this.worldWidth,
      worldHeight: this.worldHeight,
      initialSnakePosition: { ...this.initialSnakePosition },
      initialSnakeDirection: this.initialSnakeDirection,
      initialFoodPosition: { ...this.initialFoodPosition },
      moveRecord: this.moveRecord.slice(),
    };
  }

  public indexInAllPositions(x: number, y: number): number {
    return x + this.worldWidth * y;
  }

  public reset() {
    this.snake = this.getInitSnake();
    this.food = this.getRandomFoodPosition();
    this.gameOver = false;
    this.moves = 0;
    this.movesForNoFood = 0;
    this.maxMovesOfNoFood = 0;
    this.initialSnakePosition = this.snake.head.toPlainObject();
    this.initialSnakeDirection = this.snake.direction;
    this.initialFoodPosition = this.food.toPlainObject();
    this.moveRecord = [];
    this.updateMaxTurnOfNoFood();
  }

  public suicide(direction: Direction) {
    if (this.gameOver) throw new Error("suicide method is called when game is over");

    this.moves++;
    this.movesForNoFood++;
    this.gameOver = true;
    const encodedMove = this.encodeMoveRecord(direction);
    this.moveRecord.push(encodedMove);
  }

  public checkOutOfBounds(position: Position): boolean {
    return position.x < 0 || position.x >= this.worldWidth || position.y < 0 || position.y >= this.worldHeight;
  }

  public getRandomFoodPosition(): Position {
    const snakeOccupied = new Array(this.worldWidth * this.worldHeight).fill(false);
    for (const position of this.snake.positions) {
      snakeOccupied[position.x + position.y * this.worldWidth] = true;
    }
    const availablePositions = this.allPositions.filter((_, index) => !snakeOccupied[index]);
    return Utils.randomItemFromArray(availablePositions);
  }

  public snakeMoveBySnakeAction(action: SnakeAction) {
    if (this.gameOver) throw new Error("snakeMoveBySnakeAction() is called when game is over");

    const newHeadPositionAndDirection = this.snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(action);
    this.snakeMove(newHeadPositionAndDirection);
  }

  public snakeMoveByDirection(direction: Direction) {
    if (this.gameOver) throw new Error("snakeMoveByDirection() is called when game is over");

    if (this.snake.direction === oppositeDirection(direction)) {
      this.suicide(direction);
      return;
    }

    const newHeadPositionAndDirection = this.snake.getHeadPositionAndDirectionAfterMoveByDirection(direction);
    this.snakeMove(newHeadPositionAndDirection);
  }

  public snakeMoveByDirectionWithSuicidePrevention(direction: Direction) {
    if (this.gameOver) throw new Error("snakeMoveByDirectionWithSuicidePrevention() is called when game is over");

    if (this.snake.direction === oppositeDirection(direction)) return;

    const newHeadPositionAndDirection = this.snake.getHeadPositionAndDirectionAfterMoveByDirection(direction);
    this.snakeMove(newHeadPositionAndDirection);
  }

  public replayMove(moveRecord: number): void {
    const encodedDirection = moveRecord % 10;
    const direction = SnakeGame.inverseDirectionMap[encodedDirection];
    if (!direction) throw new Error("moveRecord's direction is not from 0-3");

    const newHeadPositionAndDirection = this.snake.getHeadPositionAndDirectionAfterMoveByDirection(direction);

    const haveFood = moveRecord >= 10;
    if (haveFood) {
      // minus 1 because we add 1 to avoid 0
      const foodPositionIn1D = Math.floor(moveRecord / 10) - 1;
      const providedFoodPosition = this.allPositions[foodPositionIn1D];
      if (!providedFoodPosition) throw new Error("providedFoodPosition is not valid");
      this.snakeMove(newHeadPositionAndDirection, providedFoodPosition);
    } else {
      this.snakeMove(newHeadPositionAndDirection);
    }
  }

  private snakeMove(newHeadPositionAndDirection: PositionAndDirection, providedFoodPosition?: Position) {
    const newHeadPosition = newHeadPositionAndDirection.position;
    const newHeadDirection = newHeadPositionAndDirection.direction;

    if (!newHeadPosition) {
      // out of bound
      this.suicide(newHeadDirection);
      return;
    }

    this.moves++;
    const eatFood = this.food.isEqual(newHeadPosition);
    if (eatFood) {
      this.snake.moveWithFoodEaten(newHeadDirection);
      this.movesForNoFood = 0;

      if (this.snake.positions.length >= this.worldWidth * this.worldHeight) {
        this.gameOver = true;
      } else {
        this.food = providedFoodPosition ?? this.getRandomFoodPosition();
        this.updateMaxTurnOfNoFood();
      }
    } else {
      this.movesForNoFood++;
      if (this.snake.checkEatSelfAfterMove(newHeadPosition)) {
        this.gameOver = true;
      } else {
        this.snake.move(newHeadDirection);
        if (this.movesForNoFood >= this.maxMovesOfNoFood) this.gameOver = true;
      }
    }

    const encodedMove = this.encodeMoveRecord(newHeadDirection, eatFood ? this.food : undefined);
    this.moveRecord.push(encodedMove);
  }

  private encodeMoveRecord(direction: Direction, newFoodPos?: Position): number {
    const encodedDirection = SnakeGame.directionMap[direction];

    if (newFoodPos) {
      const newFoodPosIn1D = this.indexInAllPositions(newFoodPos.x, newFoodPos.y);
      // add 1 to avoid 0
      return 10 * (newFoodPosIn1D + 1) + encodedDirection;
    }

    return encodedDirection;
  }

  private updateMaxTurnOfNoFood(): void {
    const snakeLength = this.snake.positions.length;
    if (snakeLength < 0.2 * (this.worldWidth * this.worldHeight)) {
      this.maxMovesOfNoFood = Math.max(Math.ceil(0.5 * (this.worldWidth * this.worldHeight)));
    } else if (snakeLength < 0.5 * (this.worldWidth * this.worldHeight)) {
      this.maxMovesOfNoFood = this.worldWidth * this.worldHeight;
    } else {
      this.maxMovesOfNoFood = 2 * this.worldWidth * this.worldHeight;
    }
  }

  private getInitSnake() {
    const randPosition = new Position(Math.floor(this.worldWidth / 2), Math.floor(this.worldHeight / 2));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it will always find the position
    const position = this.allPositions.find((p) => p.isEqual(randPosition))!;
    const direction = Utils.randomItemFromEnum(Direction);
    return new Snake([position], direction, this.allPositions2D);
  }

  private getInitSnakeWithProvidedPositionAndDirection(positionsPlainObject: IPosition[], direction: Direction) {
    const positions = positionsPlainObject.map((p) => new Position(p.x, p.y)).map((p) => this.allPositions.find((p2) => p2.isEqual(p)));
    if (positions.some((p) => !p)) throw new Error("Provided snake position is not valid");
    return new Snake(positions as Position[], direction, this.allPositions2D);
  }
}
