import { describe, expect, it, test } from "@jest/globals";
import Position from "../Position";
import Snake from "../Snake";
import { Direction, SnakeAction } from "../typing";
import Utils from "../Utils";
import type { IPosition } from "../Position";
import type { ISnake } from "../Snake";

const allPositions2D = [
  [new Position(0, 0), new Position(1, 0), new Position(2, 0)],
  [new Position(0, 1), new Position(1, 1), new Position(2, 1)],
  [new Position(0, 2), new Position(1, 2), new Position(2, 2)],
];

describe("test suite for Snake class", () => {
  it("fromPlainObj test", () => {
    const plainObj = {
      positions: [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
      direction: Direction.UP,
      allPositions2D,
    } satisfies ISnake;
    const snake = Snake.fromPlainObj(plainObj);
    expect((snake as unknown) instanceof Snake).toBe(true);
    expect(snake.positions.length).toBe(3);
    expect(snake.positions[0].isEqual(new Position(0, 1))).toBe(true);
    expect(snake.positions[1].isEqual(new Position(1, 1))).toBe(true);
    expect(snake.positions[2].isEqual(new Position(1, 2))).toBe(true);
    expect(snake.direction).toBe(Direction.UP);
  });

  it("toPlainObject test", () => {
    const snake = new Snake([new Position(0, 1), new Position(1, 1), new Position(1, 2)], Direction.LEFT, allPositions2D);
    const plainObj = snake.toPlainObject();
    expect(plainObj instanceof Snake).toBe(false);
    const expectedPositions = [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ];
    const expectedAllPositions2d = [
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
      [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      [
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ],
    ];
    const expectedPlainObj = {
      positions: expectedPositions,
      direction: Direction.LEFT,
      allPositions2D: expectedAllPositions2d,
    } satisfies ISnake;
    expect(plainObj).toStrictEqual(expectedPlainObj);
    expect(JSON.stringify(plainObj)).toBe(JSON.stringify(expectedPlainObj));
  });

  describe("test suite for getter head and length", () => {
    const snake1 = new Snake([new Position(0, 1)], Direction.LEFT, allPositions2D);
    const snake2 = new Snake([new Position(0, 1), new Position(1, 1), new Position(1, 2)], Direction.LEFT, allPositions2D);
    test.each<{ name: string; snake: Snake; expectedHeadPositionData: IPosition; expectedLength: number }>`
      name        | snake     | expectedHeadPositionData | expectedLength
      ${"test 1"} | ${snake1} | ${{ x: 0, y: 1 }}        | ${1}
      ${"test 2"} | ${snake2} | ${{ x: 0, y: 1 }}        | ${3}
    `(" $name", ({ snake, expectedHeadPositionData, expectedLength }) => {
      const expectedHeadPosition = new Position(expectedHeadPositionData.x, expectedHeadPositionData.y);
      expect(snake.head.isEqual(expectedHeadPosition)).toBe(true);
      expect(snake.length).toBe(expectedLength);
    });
  });

  describe("positionInSnake tests", () => {
    const snake1 = new Snake([new Position(0, 1)], Direction.LEFT, allPositions2D);
    const snake2 = new Snake([new Position(0, 1), new Position(1, 1), new Position(1, 2)], Direction.LEFT, allPositions2D);

    test.each<{ name: string; snake: Snake; positionData: IPosition; expected: boolean }>`
      name         | snake     | positionData      | expected
      ${"test 1"}  | ${snake1} | ${{ x: 0, y: 1 }} | ${true}
      ${"test 2"}  | ${snake1} | ${{ x: 1, y: 1 }} | ${false}
      ${"test 3"}  | ${snake1} | ${{ x: 1, y: 2 }} | ${false}
      ${"test 4"}  | ${snake2} | ${{ x: 0, y: 1 }} | ${true}
      ${"test 5"}  | ${snake2} | ${{ x: 1, y: 1 }} | ${true}
      ${"test 6"}  | ${snake2} | ${{ x: 1, y: 2 }} | ${true}
      ${"test 7"}  | ${snake2} | ${{ x: 0, y: 2 }} | ${false}
      ${"test 8"}  | ${snake2} | ${{ x: 2, y: 2 }} | ${false}
      ${"test 9"}  | ${snake2} | ${{ x: 2, y: 1 }} | ${false}
      ${"test 10"} | ${snake2} | ${{ x: 2, y: 0 }} | ${false}
    `("$name", ({ snake, positionData, expected }) => {
      const position = new Position(positionData.x, positionData.y);
      expect(snake.positionInSnake(position)).toBe(expected);
    });
  });

  describe("checkEatSelfAfterMove tests", () => {
    const snake1 = () => new Snake([new Position(1, 1)], Direction.DOWN, allPositions2D);
    const snake2 = () => new Snake([new Position(1, 1), new Position(1, 2), new Position(2, 2), new Position(2, 1)], Direction.UP, allPositions2D);

    it.each<{ name: string; snake: Snake; direction: Direction; expected: boolean }>`
      name        | snake       | direction          | expected
      ${"test 1"} | ${snake1()} | ${Direction.UP}    | ${false}
      ${"test 2"} | ${snake1()} | ${Direction.LEFT}  | ${false}
      ${"test 3"} | ${snake1()} | ${Direction.RIGHT} | ${false}
      ${"test 4"} | ${snake2()} | ${Direction.DOWN}  | ${true}
      ${"test 5"} | ${snake2()} | ${Direction.LEFT}  | ${false}
      ${"test 6"} | ${snake2()} | ${Direction.RIGHT} | ${false}
    `("$name", ({ snake, direction, expected }) => {
      const x = snake.getHeadPositionAndDirectionAfterMoveByDirection(direction);
      if (!x.position) throw new Error("position is null");
      expect(snake.checkEatSelfAfterMove(x.position)).toBe(expected);
    });
  });

  describe("getHeadPositionAndDirectionAfterMoveBySnakeAction tests", () => {
    const snake1 = new Snake([new Position(1, 1)], Direction.UP, allPositions2D);
    const snake2 = new Snake([new Position(1, 1)], Direction.DOWN, allPositions2D);
    const snake3 = new Snake([new Position(1, 1)], Direction.LEFT, allPositions2D);
    const snake4 = new Snake([new Position(1, 1)], Direction.RIGHT, allPositions2D);
    const snake5 = new Snake([new Position(0, 0)], Direction.UP, allPositions2D);
    const snake6 = new Snake([new Position(2, 2)], Direction.DOWN, allPositions2D);

    test.each<{ name: string; snake: Snake; action: SnakeAction; expectedPosition: IPosition; expectedDirection: Direction }>`
      name                    | snake     | action                    | expectedPosition  | expectedDirection
      ${"snake1, FRONT"}      | ${snake1} | ${SnakeAction.FRONT}      | ${{ x: 1, y: 0 }} | ${Direction.UP}
      ${"snake1, TURN_LEFT"}  | ${snake1} | ${SnakeAction.TURN_LEFT}  | ${{ x: 0, y: 1 }} | ${Direction.LEFT}
      ${"snake1, TURN_RIGHT"} | ${snake1} | ${SnakeAction.TURN_RIGHT} | ${{ x: 2, y: 1 }} | ${Direction.RIGHT}
      ${"snake2, FRONT"}      | ${snake2} | ${SnakeAction.FRONT}      | ${{ x: 1, y: 2 }} | ${Direction.DOWN}
      ${"snake2, TURN_LEFT"}  | ${snake2} | ${SnakeAction.TURN_LEFT}  | ${{ x: 2, y: 1 }} | ${Direction.RIGHT}
      ${"snake2, TURN_RIGHT"} | ${snake2} | ${SnakeAction.TURN_RIGHT} | ${{ x: 0, y: 1 }} | ${Direction.LEFT}
      ${"snake3, FRONT"}      | ${snake3} | ${SnakeAction.FRONT}      | ${{ x: 0, y: 1 }} | ${Direction.LEFT}
      ${"snake3, TURN_LEFT"}  | ${snake3} | ${SnakeAction.TURN_LEFT}  | ${{ x: 1, y: 2 }} | ${Direction.DOWN}
      ${"snake3, TURN_RIGHT"} | ${snake3} | ${SnakeAction.TURN_RIGHT} | ${{ x: 1, y: 0 }} | ${Direction.UP}
      ${"snake4, FRONT"}      | ${snake4} | ${SnakeAction.FRONT}      | ${{ x: 2, y: 1 }} | ${Direction.RIGHT}
      ${"snake4, TURN_LEFT"}  | ${snake4} | ${SnakeAction.TURN_LEFT}  | ${{ x: 1, y: 0 }} | ${Direction.UP}
      ${"snake4, TURN_RIGHT"} | ${snake4} | ${SnakeAction.TURN_RIGHT} | ${{ x: 1, y: 2 }} | ${Direction.DOWN}
      ${"snake5, FRONT"}      | ${snake5} | ${SnakeAction.FRONT}      | ${null}           | ${Direction.UP}
      ${"snake5, TURN_LEFT"}  | ${snake5} | ${SnakeAction.TURN_LEFT}  | ${null}           | ${Direction.LEFT}
      ${"snake5, TURN_RIGHT"} | ${snake5} | ${SnakeAction.TURN_RIGHT} | ${{ x: 1, y: 0 }} | ${Direction.RIGHT}
      ${"snake6, FRONT"}      | ${snake6} | ${SnakeAction.FRONT}      | ${null}           | ${Direction.DOWN}
      ${"snake6, TURN_LEFT"}  | ${snake6} | ${SnakeAction.TURN_LEFT}  | ${null}           | ${Direction.RIGHT}
      ${"snake6, TURN_RIGHT"} | ${snake6} | ${SnakeAction.TURN_RIGHT} | ${{ x: 1, y: 2 }} | ${Direction.LEFT}
    `("getHeadPositionAndDirectionAfterMoveBySnakeAction $name", ({ snake, action, expectedPosition, expectedDirection }) => {
      expect(snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(action)).toStrictEqual({
        position: expectedPosition ? new Position(expectedPosition.x, expectedPosition.y) : expectedPosition,
        direction: expectedDirection,
      });
    });
  });

  describe("getHeadPositionAndDirectionAfterMoveByDirection tests", () => {
    const snake1 = new Snake([new Position(1, 1)], Direction.UP, allPositions2D);
    const snake2 = new Snake([new Position(0, 0)], Direction.UP, allPositions2D);

    it.each<{ name: string; snake: Snake; direction: Direction; expectedPosition: IPosition; expectedDirection: Direction }>`
      name               | snake     | direction          | expectedPosition  | expectedDirection
      ${"snake1, UP"}    | ${snake1} | ${Direction.UP}    | ${{ x: 1, y: 0 }} | ${Direction.UP}
      ${"snake1, DOWN"}  | ${snake1} | ${Direction.DOWN}  | ${{ x: 1, y: 2 }} | ${Direction.DOWN}
      ${"snake1, LEFT"}  | ${snake1} | ${Direction.LEFT}  | ${{ x: 0, y: 1 }} | ${Direction.LEFT}
      ${"snake1, RIGHT"} | ${snake1} | ${Direction.RIGHT} | ${{ x: 2, y: 1 }} | ${Direction.RIGHT}
      ${"snake2, UP"}    | ${snake2} | ${Direction.UP}    | ${null}           | ${Direction.UP}
      ${"snake2, DOWN"}  | ${snake2} | ${Direction.DOWN}  | ${{ x: 0, y: 1 }} | ${Direction.DOWN}
      ${"snake2, LEFT"}  | ${snake2} | ${Direction.LEFT}  | ${null}           | ${Direction.LEFT}
      ${"snake2, RIGHT"} | ${snake2} | ${Direction.RIGHT} | ${{ x: 1, y: 0 }} | ${Direction.RIGHT}
    `(" $name", ({ snake, direction, expectedPosition, expectedDirection }) => {
      expect(snake.getHeadPositionAndDirectionAfterMoveByDirection(direction)).toStrictEqual({
        position: expectedPosition ? new Position(expectedPosition.x, expectedPosition.y) : expectedPosition,
        direction: expectedDirection,
      });
    });
  });

  it("move test 1", () => {
    for (const direction of Utils.enumToArray(Direction)) {
      for (const snakeAction of Utils.enumToArray(SnakeAction)) {
        const snake = new Snake([new Position(1, 1)], direction, allPositions2D);
        const positionAndDirection = snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(snakeAction);
        if (!positionAndDirection.position) throw new Error("positionAndDirection.position is null");
        snake.move(positionAndDirection.direction);
        expect(snake.positions.length).toBe(1);
        expect(snake.positions).toStrictEqual([positionAndDirection.position]);
        expect(snake.direction).toBe(positionAndDirection.direction);
      }
    }
  });

  it("move test 2", () => {
    const positions = [new Position(1, 1), new Position(1, 2), new Position(2, 2), new Position(2, 1)];
    for (const snakeAction of Utils.enumToArray(SnakeAction)) {
      const snake = new Snake(positions, Direction.UP, allPositions2D);
      const positionAndDirection = snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(snakeAction);
      if (!positionAndDirection.position) throw new Error("positionAndDirection.position is null");
      snake.move(positionAndDirection.direction);
      expect(snake.positions.length).toBe(4);
      expect(snake.positions).toStrictEqual([positionAndDirection.position, positions[0], positions[1], positions[2]]);
      expect(snake.direction).toBe(positionAndDirection.direction);
    }
  });

  it("moveWithFoodEaten test 1", () => {
    for (const direction of Utils.enumToArray(Direction)) {
      for (const snakeAction of Utils.enumToArray(SnakeAction)) {
        const snake = new Snake([new Position(1, 1)], direction, allPositions2D);
        const positionAndDirection = snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(snakeAction);
        if (!positionAndDirection.position) throw new Error("positionAndDirection.position is null");
        snake.moveWithFoodEaten(positionAndDirection.direction);
        expect(snake.positions.length).toBe(2);
        expect(snake.positions).toStrictEqual([positionAndDirection.position, new Position(1, 1)]);
        expect(snake.direction).toBe(positionAndDirection.direction);
      }
    }
  });

  it("moveWithFoodEaten test 2", () => {
    const positions = [new Position(1, 1), new Position(1, 2), new Position(2, 2), new Position(2, 1)];
    for (const snakeAction of Utils.enumToArray(SnakeAction)) {
      const snake = new Snake(positions, Direction.UP, allPositions2D);
      const positionAndDirection = snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(snakeAction);
      if (!positionAndDirection.position) throw new Error("positionAndDirection.position is null");
      snake.moveWithFoodEaten(positionAndDirection.direction);
      expect(snake.positions.length).toBe(5);
      expect(snake.positions).toStrictEqual([positionAndDirection.position, positions[0], positions[1], positions[2], positions[3]]);
      expect(snake.direction).toBe(positionAndDirection.direction);
    }
  });
});
