import { Direction } from "./typing";
import { utils } from "./utils";
import Position from "./Position";
import type SnakeGame from "./SnakeGame";

interface RelativePosition {
  dx: number;
  dy: number;
}

export const slopeMap4: RelativePosition[] = [
  { dx: 0, dy: 1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: -1, dy: 0 },
];

export const slopeMap8: RelativePosition[] = [
  { dx: 0, dy: 1 },
  { dx: 1, dy: 1 },
  { dx: 1, dy: 0 },
  { dx: 1, dy: -1 },
  { dx: 0, dy: -1 },
  { dx: -1, dy: -1 },
  { dx: -1, dy: 0 },
  { dx: -1, dy: 1 },
];

export const slopeMap16: RelativePosition[] = [
  { dx: 0, dy: 1 },
  { dx: 1, dy: 2 },
  { dx: 1, dy: 1 },
  { dx: 2, dy: 1 },
  { dx: 1, dy: 0 },
  { dx: 2, dy: -1 },
  { dx: 1, dy: -1 },
  { dx: 1, dy: -2 },
  { dx: 0, dy: -1 },
  { dx: -1, dy: -2 },
  { dx: -1, dy: -1 },
  { dx: -2, dy: -1 },
  { dx: -1, dy: 0 },
  { dx: -2, dy: 1 },
  { dx: -1, dy: 1 },
  { dx: -1, dy: 2 },
];

export default class InputLayer {
  private readonly template: number[];
  private readonly numOfBoardCell: number;
  private readonly game: SnakeGame;

  constructor(game: SnakeGame) {
    this.game = game;
    this.numOfBoardCell = this.game.worldWidth * this.game.worldHeight;

    // total length is 25
    // 0-3: is food in slope map position relative to snake head
    // 4-7: is snake slope map position relative to snake head
    // 8-11: is out of bound in slope map position relative to snake head
    // 12-15: is direction of snake head
    // 16-19 is food-snake distance
    // 20-23 is snake portion
    // 24 is snakeLength/(worldWidth*worldHeight)
    this.template = Array(slopeMap4.length * 3 + 4 + 4 + 4 + 1).fill(0);
  }

  public get inputLayerLength(): number {
    return this.template.length;
  }

  public compute(): number[] {
    const result = utils.clone1dArr(this.template);

    const foodSnakeOutOfBound = this.foodSnakeOutOfBoundValue(slopeMap4);
    const foodSnakeOutOfBoundStartIndex = 0;
    foodSnakeOutOfBound.forEach((v, index) => (result[foodSnakeOutOfBoundStartIndex + index] = v));

    const directionValue = this.currentDirectionValue();
    const directionStartIndex = slopeMap4.length * 3;
    directionValue.forEach((v, index) => (result[directionStartIndex + index] = v));

    const foodDistance = this.foodDistanceValue();
    const foodDistanceStartIndex = directionStartIndex + directionValue.length;
    foodDistance.forEach((v, index) => (result[foodDistanceStartIndex + index] = v));

    const snakePortion = this.snakePortionValue();
    const snakePortionStartIndex = foodDistanceStartIndex + foodDistance.length;
    snakePortion.forEach((v, index) => (result[snakePortionStartIndex + index] = v));

    const snakeLengthWorldRatio = this.getSnakeLengthWorldRatio();
    const snakeLengthWorldRatioIndex = snakePortionStartIndex + snakePortion.length;
    result[snakeLengthWorldRatioIndex] = snakeLengthWorldRatio;

    return result;
  }

  public foodSnakeOutOfBoundValue(relativePositions: RelativePosition[]): number[] {
    const result = Array(relativePositions.length * 3).fill(0);
    const snakeHead = this.game.snake.head;

    const foodStartIndex = 0;
    const snakeStartIndex = relativePositions.length;
    const outOfBoundStartIndex = relativePositions.length * 2;

    relativePositions.forEach((s, index) => {
      const pos = new Position(snakeHead.x + s.dx, snakeHead.y + s.dy);
      result[foodStartIndex + index] = this.game.food.isEqual(pos) ? 1 : 0;
      result[snakeStartIndex + index] = this.game.snake.positionInSnake(pos) ? 1 : 0;
      result[outOfBoundStartIndex + index] = this.game.checkOutOfBounds(pos) ? 1 : 0;
    });
    return result;
  }

  public currentDirectionValue(): number[] {
    switch (this.game.snake.direction) {
      case Direction.UP:
        return [1, 0, 0, 0];
      case Direction.DOWN:
        return [0, 1, 0, 0];
      case Direction.LEFT:
        return [0, 0, 1, 0];
      case Direction.RIGHT:
        return [0, 0, 0, 1];
    }
  }

  public foodDistanceValue(): number[] {
    const { food, snake } = this.game;
    const fx = food.x;
    const fy = food.y;
    const sx = snake.head.x;
    const sy = snake.head.y;

    // y increase from top to bottom
    const top = fy <= sy ? sy - fy : 0;
    const bottom = fy >= sy ? fy - sy : 0;
    const left = fx <= sx ? sx - fx : 0;
    const right = fx >= sx ? fx - sx : 0;

    return [top, bottom, left, right].map((num) => (num <= 0 ? 0 : 1 / num));
  }

  public snakePortionValue(): number[] {
    const snakeHead = this.game.snake.positions[0];

    const [topCount, bottomCount]: [number, number] = this.game.snake.positions.reduce(
      (acc, pos) => {
        if (pos.y < snakeHead.y) {
          acc[0]++;
        } else if (pos.y > snakeHead.y) {
          acc[1]++;
        }
        return acc;
      },
      [0, 0]
    );

    const [leftCount, rightCount]: [number, number] = this.game.snake.positions.reduce(
      (acc, pos) => {
        if (pos.x < snakeHead.x) {
          acc[0]++;
        } else if (pos.x > snakeHead.x) {
          acc[1]++;
        }
        return acc;
      },
      [0, 0]
    );

    return [topCount, bottomCount, leftCount, rightCount].map((x) => x / this.numOfBoardCell);
  }

  public getSnakeLengthWorldRatio() {
    return this.game.snake.positions.length / (this.game.worldWidth * this.game.worldHeight);
  }
}
