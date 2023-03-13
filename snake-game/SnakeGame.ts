import Position from "./Position";
import Snake from "./Snake";
import { Direction } from "./typing";
import { utils } from "./utils";
import { oppositeDirection } from "./oppositeDirection";
import type { SnakeAction, PositionAndDirection } from "./typing";
import type { ISnake } from "./Snake";
import type { IPosition } from "./Position";

export interface ProvidedInitialStatus {
  snake: ISnake;
  food: IPosition;
  gameOver: boolean;
  moves: number;
  movesForNoFood: number;
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
  maxTurnOfNoFood: number;
}

export default class SnakeGame implements ISnakeGame {
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
      },
    });
  }

  public worldWidth: number;
  public worldHeight: number;
  public allPositions: Position[];
  public snake: Snake;
  public food: Position;
  public gameOver: boolean;
  public moves: number;
  public movesForNoFood: number;
  public maxTurnOfNoFood: number;

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
      this.maxTurnOfNoFood = 0;
      this.updateMaxTurnOfNoFood();
    } else {
      this.snake = this.getInitSnake();
      this.food = this.getRandomFoodPosition();
      this.gameOver = false;
      this.moves = 0;
      this.movesForNoFood = 0;
      this.maxTurnOfNoFood = 0;
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
      maxTurnOfNoFood: this.maxTurnOfNoFood,
    };
  }

  public reset() {
    this.snake = this.getInitSnake();
    this.food = this.getRandomFoodPosition();
    this.gameOver = false;
    this.moves = 0;
    this.movesForNoFood = 0;
    this.maxTurnOfNoFood = 0;
    this.updateMaxTurnOfNoFood();
  }

  public suicide() {
    if (this.gameOver) throw new Error("suicide() is called when game is over");

    this.moves++;
    this.movesForNoFood++;
    this.gameOver = true;
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

  private snakeMove(newHeadPositionAndDirection: PositionAndDirection) {
    this.moves++;
    const eatFood = this.food.isEqual(newHeadPositionAndDirection.position);
    if (eatFood) {
      this.snake.moveWithFoodEaten(newHeadPositionAndDirection);
      this.movesForNoFood = 0;

      if (this.snake.positions.length >= this.worldWidth * this.worldHeight) {
        this.gameOver = true;
      } else {
        this.food = this.getRandomFoodPosition();
        this.updateMaxTurnOfNoFood();
      }
    } else {
      this.movesForNoFood++;

      if (this.snake.checkCollisionAfterMove(newHeadPositionAndDirection.position) || this.checkOutOfBounds(newHeadPositionAndDirection.position)) {
        this.gameOver = true;
      } else {
        this.snake.move(newHeadPositionAndDirection);
        if (this.movesForNoFood >= this.maxTurnOfNoFood) this.gameOver = true;
      }
    }
  }

  private updateMaxTurnOfNoFood(): void {
    const snakeLength = this.snake.positions.length;
    if (snakeLength < 0.2 * (this.worldWidth * this.worldHeight)) {
      this.maxTurnOfNoFood = Math.max(Math.ceil(0.5 * (this.worldWidth * this.worldHeight)));
    } else if (snakeLength < 0.5 * (this.worldWidth * this.worldHeight)) {
      this.maxTurnOfNoFood = this.worldWidth * this.worldHeight;
    } else {
      this.maxTurnOfNoFood = 2 * this.worldWidth * this.worldHeight;
    }
  }

  private getInitSnake() {
    const position = new Position(Math.floor(this.worldWidth / 2), Math.floor(this.worldHeight / 2));
    const direction = utils.randomItemFromEnum(Direction);
    return new Snake([position], direction);
  }
}
