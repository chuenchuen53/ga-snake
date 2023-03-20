import Position from "./Position";
import Snake from "./Snake";
import { Direction } from "./typing";
import { utils } from "./utils";
import { oppositeDirection } from "./oppositeDirection";
import type { SnakeAction, PositionAndDirection } from "./typing";
import type { ISnake } from "./Snake";
import type { IPosition } from "./Position";

export interface GameRecord {
  worldWidth: number;
  worldHeight: number;
  initialSnakePosition: IPosition;
  initialSnakeDirection: Direction;
  initialFoodPosition: IPosition;
  moveRecord: number[];
}

export interface ProvidedInitialStatus {
  snake: ISnake;
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

  public static relativeDirection(ori: Position, target: Position) {
    if (ori.x < target.x) return Direction.RIGHT;
    if (ori.x > target.x) return Direction.LEFT;
    if (ori.y < target.y) return Direction.DOWN;
    if (ori.y > target.y) return Direction.UP;
    return Direction.UP;
  }

  public static clone(snakeGame: SnakeGame): SnakeGame {
    return new SnakeGame({
      worldWidth: snakeGame.worldWidth,
      worldHeight: snakeGame.worldHeight,
      providedInitialStatus: {
        snake: snakeGame.snake.toPlainObject(),
        food: snakeGame.food.toPlainObject(),
        gameOver: snakeGame.gameOver,
        moves: snakeGame.moves,
        movesForNoFood: snakeGame.movesForNoFood,
        initialSnakePosition: { ...snakeGame.initialSnakePosition },
        initialSnakeDirection: snakeGame.initialSnakeDirection,
        initialFoodPosition: { ...snakeGame.initialFoodPosition },
        moveRecord: snakeGame.moveRecord.slice(),
      },
    });
  }

  public static cloneGameRecord(gameRecord: GameRecord): GameRecord {
    const moveRecord = gameRecord.moveRecord.slice();
    return {
      ...gameRecord,
      moveRecord,
    };
  }

  public worldWidth: number;
  public worldHeight: number;
  public allPositions: Position[];
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
    for (let i = 0; i < this.worldWidth; i++) {
      for (let j = 0; j < this.worldHeight; j++) {
        this.allPositions[i * this.worldHeight + j] = new Position(i, j);
      }
    }

    if (options.providedInitialStatus) {
      this.snake = Snake.fromPlainObj(options.providedInitialStatus.snake);
      this.food = Position.fromPlainObj(options.providedInitialStatus.food);
      this.gameOver = options.providedInitialStatus.gameOver;
      this.moves = options.providedInitialStatus.moves;
      this.movesForNoFood = options.providedInitialStatus.movesForNoFood;
      this.maxMovesOfNoFood = 0;
      this.initialSnakePosition = { ...options.providedInitialStatus.initialSnakePosition };
      this.initialSnakeDirection = options.providedInitialStatus.initialSnakeDirection;
      this.initialFoodPosition = { ...options.providedInitialStatus.initialFoodPosition };
      this.moveRecord = options.providedInitialStatus.moveRecord;

      this.updateMaxTurnOfNoFood();
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

      this.updateMaxTurnOfNoFood();
    }
  }

  public toPlainObject(): ISnakeGame {
    return {
      worldWidth: this.worldWidth,
      worldHeight: this.worldHeight,
      allPositions: this.allPositions.map((position) => position.toPlainObject()),
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
      snake: this.snake.toPlainObject(),
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

  public to1DIndex(x: number, y: number): number {
    return x * this.worldHeight + y;
  }

  public to2DIndex(oneDIndex: number): number[] {
    const y = oneDIndex % this.worldHeight;
    const x = (oneDIndex - y) / this.worldHeight;
    return [x, y];
  }

  public encodeMoveRecord(oriSnakeHeadPos: Position, targetSnakeHeadPos: Position, newFoodPos?: Position): number {
    const relativeDirection = SnakeGame.directionMap[SnakeGame.relativeDirection(oriSnakeHeadPos, targetSnakeHeadPos)];

    if (newFoodPos) {
      const newFoodPosIn1D = this.to1DIndex(newFoodPos.x, newFoodPos.y);
      // add 1 to avoid 0
      return 10 * (newFoodPosIn1D + 1) + relativeDirection;
    }

    return relativeDirection;
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

  public suicide() {
    if (this.gameOver) throw new Error("suicide() is called when game is over");

    this.moves++;
    this.movesForNoFood++;
    this.gameOver = true;
    this.moveRecord.push(-1);
  }

  public checkOutOfBounds(position: Position): boolean {
    return position.x < 0 || position.x >= this.worldWidth || position.y < 0 || position.y >= this.worldHeight;
  }

  public getRandomFoodPosition(): Position {
    const snakeOccupied = new Array(this.worldWidth * this.worldHeight).fill(false);
    for (const position of this.snake.positions) {
      snakeOccupied[position.x * this.worldHeight + position.y] = true;
    }
    const availablePositions = this.allPositions.filter((_, index) => !snakeOccupied[index]);
    return utils.randomItemFromArray(availablePositions);
  }

  public snakeMoveBySnakeAction(action: SnakeAction) {
    if (this.gameOver) throw new Error("snakeMoveBySnakeAction() is called when game is over");

    const newHeadPositionAndDirection = this.snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(action);
    this.snakeMove(newHeadPositionAndDirection);
  }

  public snakeMoveByDirection(direction: Direction) {
    if (this.gameOver) throw new Error("snakeMoveByDirection() is called when game is over");

    if (this.snake.direction === oppositeDirection(direction)) {
      this.suicide();
      return;
    }

    const newHeadPositionAndDirection = this.snake.getHeadPositionAndDirectionAfterMoveByDirection(direction);
    this.snakeMove(newHeadPositionAndDirection);
  }

  public snakeMoveByDirectionWithSuicidePrevention(direction: Direction) {
    if (this.gameOver) throw new Error("snakeMoveByDirectionWithSuicidePrevention() is called when game is over");

    if (this.snake.direction === oppositeDirection(direction)) {
      return;
    }

    const newHeadPositionAndDirection = this.snake.getHeadPositionAndDirectionAfterMoveByDirection(direction);
    this.snakeMove(newHeadPositionAndDirection);
  }

  public replayMove(moveRecord: number): void {
    const encodedDirection = moveRecord % 10;
    const direction = SnakeGame.inverseDirectionMap[encodedDirection];
    if (!direction) throw new Error("moveRecordRow.move is not from 0-3");

    const newHeadPositionAndDirection = this.snake.getHeadPositionAndDirectionAfterMoveByDirection(direction);

    const haveFood = moveRecord >= 10;
    if (haveFood) {
      // minus 1 because we add 1 to avoid 0
      const foodPositionIn1D = Math.floor(moveRecord / 10) - 1;
      const [fx, fy] = this.to2DIndex(foodPositionIn1D);
      const foodPosition = new Position(fx, fy);
      const providedFoodPosition = this.allPositions.find((p) => p.isEqual(foodPosition));
      if (!providedFoodPosition) throw new Error("providedFoodPosition is not valid");
      this.snakeMove(newHeadPositionAndDirection, providedFoodPosition);
    } else {
      this.snakeMove(newHeadPositionAndDirection);
    }
  }

  private snakeMove(newHeadPositionAndDirection: PositionAndDirection, providedFoodPosition?: Position) {
    this.moves++;

    const oriSnakeHeadPos = this.snake.head;

    const eatFood = this.food.isEqual(newHeadPositionAndDirection.position);
    if (eatFood) {
      this.snake.moveWithFoodEaten(newHeadPositionAndDirection);
      this.movesForNoFood = 0;

      if (this.snake.positions.length >= this.worldWidth * this.worldHeight) {
        this.gameOver = true;
      } else {
        this.food = providedFoodPosition ? providedFoodPosition : this.getRandomFoodPosition();
        this.updateMaxTurnOfNoFood();
      }
    } else {
      this.movesForNoFood++;

      if (this.snake.checkCollisionAfterMove(newHeadPositionAndDirection.position) || this.checkOutOfBounds(newHeadPositionAndDirection.position)) {
        this.gameOver = true;
      } else {
        this.snake.move(newHeadPositionAndDirection);
        if (this.movesForNoFood >= this.maxMovesOfNoFood) this.gameOver = true;
      }
    }

    const encodedMove = this.encodeMoveRecord(oriSnakeHeadPos, newHeadPositionAndDirection.position, eatFood ? this.food : undefined);
    this.moveRecord.push(encodedMove);
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
    const position = new Position(Math.floor(this.worldWidth / 2), Math.floor(this.worldHeight / 2));
    const direction = utils.randomItemFromEnum(Direction);
    return new Snake([position], direction);
  }
}
