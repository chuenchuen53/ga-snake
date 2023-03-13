import Position from "../Position";
import Snake from "../Snake";
import { Direction, SnakeAction } from "../typing";
import { utils } from "../utils";

describe("test suite for Snake", () => {
  it("fromPlainObj test", () => {
    const plainObj = {
      positions: [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
      direction: Direction.UP,
    };
    const snake = Snake.fromPlainObj(plainObj);
    expect(snake instanceof Snake).toBe(true);
    expect(snake.positions.length).toBe(3);
    expect(snake.positions[0].x).toBe(0);
    expect(snake.positions[0].y).toBe(1);
    expect(snake.positions[0].isEqual(new Position(0, 1))).toBe(true);
    expect(snake.positions[1].x).toBe(1);
    expect(snake.positions[1].y).toBe(1);
    expect(snake.positions[1].isEqual(new Position(1, 1))).toBe(true);
    expect(snake.positions[2].x).toBe(1);
    expect(snake.positions[2].y).toBe(2);
    expect(snake.positions[2].isEqual(new Position(1, 2))).toBe(true);
    expect(snake.direction).toBe(Direction.UP);
    expect(typeof snake.checkCollisionAfterMove(new Position(0, 0))).toBe("boolean");
  });

  it("toPlainObject test", () => {
    const snake = new Snake([new Position(0, 1), new Position(1, 1), new Position(1, 2)], Direction.LEFT);
    const plainObj = snake.toPlainObject();
    expect(plainObj instanceof Snake).toBe(false);
    expect(plainObj).toStrictEqual({
      positions: [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
      direction: Direction.LEFT,
    });
    expect(JSON.stringify(plainObj)).toBe(
      JSON.stringify({
        positions: [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 2 },
        ],
        direction: Direction.LEFT,
      })
    );
  });

  it("checkCollisionAfterMove test 1", () => {
    const snake = new Snake([new Position(0, 0)], Direction.DOWN);
    // this case wont happen in the game, as (0, 0) is not adjacent to the snake head
    // just for testing
    expect(snake.checkCollisionAfterMove(new Position(0, 0))).toBe(false);
  });

  it("checkCollisionAfterMove test 2", () => {
    const snake = new Snake([new Position(1, 1), new Position(1, 2), new Position(2, 2), new Position(2, 1)], Direction.UP);

    const left = new Position(0, 1);
    const right = new Position(2, 1);
    const up = new Position(1, 0);
    const down = new Position(1, 2);

    expect(snake.checkCollisionAfterMove(left)).toBe(false);
    // tail
    expect(snake.checkCollisionAfterMove(right)).toBe(false);
    expect(snake.checkCollisionAfterMove(up)).toBe(false);
    expect(snake.checkCollisionAfterMove(down)).toBe(true);
  });

  it("getHeadPositionAndDirectionAfterMove test 1", () => {
    const snake = new Snake([new Position(1, 1)], Direction.UP);

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.FRONT)).toStrictEqual({
      position: new Position(1, 0),
      direction: Direction.UP,
    });

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.TURN_LEFT)).toStrictEqual({
      position: new Position(0, 1),
      direction: Direction.LEFT,
    });

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.TURN_RIGHT)).toStrictEqual({
      position: new Position(2, 1),
      direction: Direction.RIGHT,
    });
  });

  it("getHeadPositionAndDirectionAfterMove test 2", () => {
    const snake = new Snake([new Position(1, 1)], Direction.DOWN);

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.FRONT)).toStrictEqual({
      position: new Position(1, 2),
      direction: Direction.DOWN,
    });

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.TURN_LEFT)).toStrictEqual({
      position: new Position(2, 1),
      direction: Direction.RIGHT,
    });

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.TURN_RIGHT)).toStrictEqual({
      position: new Position(0, 1),
      direction: Direction.LEFT,
    });
  });

  it("getHeadPositionAndDirectionAfterMove test 3", () => {
    const snake = new Snake([new Position(1, 1)], Direction.LEFT);

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.FRONT)).toStrictEqual({
      position: new Position(0, 1),
      direction: Direction.LEFT,
    });

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.TURN_LEFT)).toStrictEqual({
      position: new Position(1, 2),
      direction: Direction.DOWN,
    });

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.TURN_RIGHT)).toStrictEqual({
      position: new Position(1, 0),
      direction: Direction.UP,
    });
  });

  it("getHeadPositionAndDirectionAfterMove test 4", () => {
    const snake = new Snake([new Position(1, 1)], Direction.RIGHT);

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.FRONT)).toStrictEqual({
      position: new Position(2, 1),
      direction: Direction.RIGHT,
    });

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.TURN_LEFT)).toStrictEqual({
      position: new Position(1, 0),
      direction: Direction.UP,
    });

    expect(snake.getHeadPositionAndDirectionAfterMove(SnakeAction.TURN_RIGHT)).toStrictEqual({
      position: new Position(1, 2),
      direction: Direction.DOWN,
    });
  });

  it("move test 1", () => {
    for (const direction of utils.enumToArray(Direction)) {
      for (const snakeAction of utils.enumToArray(SnakeAction)) {
        const snake = new Snake([new Position(1, 1)], direction);
        const positionAndDirection = snake.getHeadPositionAndDirectionAfterMove(snakeAction);
        snake.move(positionAndDirection);
        expect(snake.positions.length).toBe(1);
        expect(snake.positions).toStrictEqual([positionAndDirection.position]);
        expect(snake.direction).toBe(positionAndDirection.direction);
      }
    }
  });

  it("move test 2", () => {
    const positions = [new Position(1, 1), new Position(1, 2), new Position(2, 2), new Position(2, 1)];
    const snake = new Snake(positions, Direction.UP);
    const positionAndDirection = snake.getHeadPositionAndDirectionAfterMove(SnakeAction.FRONT);
    snake.move(positionAndDirection);
    expect(snake.positions.length).toBe(4);
    expect(snake.positions).toStrictEqual([positionAndDirection.position, positions[0], positions[1], positions[2]]);
    expect(snake.direction).toBe(positionAndDirection.direction);
  });

  it("moveWithFoodEaten test 1", () => {
    for (const direction of utils.enumToArray(Direction)) {
      for (const snakeAction of utils.enumToArray(SnakeAction)) {
        const snake = new Snake([new Position(1, 1)], direction);
        const positionAndDirection = snake.getHeadPositionAndDirectionAfterMove(snakeAction);
        snake.moveWithFoodEaten(positionAndDirection);
        expect(snake.positions.length).toBe(2);
        expect(snake.positions).toStrictEqual([positionAndDirection.position, new Position(1, 1)]);
        expect(snake.direction).toBe(positionAndDirection.direction);
      }
    }
  });

  it("moveWithFoodEaten test 2", () => {
    const positions = [new Position(1, 1), new Position(1, 2), new Position(2, 2), new Position(2, 1)];
    const snake = new Snake(positions, Direction.UP);
    const positionAndDirection = snake.getHeadPositionAndDirectionAfterMove(SnakeAction.FRONT);
    snake.moveWithFoodEaten(positionAndDirection);
    expect(snake.positions.length).toBe(5);
    expect(snake.positions).toStrictEqual([positionAndDirection.position, positions[0], positions[1], positions[2], positions[3]]);
    expect(snake.direction).toBe(positionAndDirection.direction);
  });
});
