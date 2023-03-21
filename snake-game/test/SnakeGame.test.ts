import { describe, expect, it, jest } from "@jest/globals";
import SnakeGame from "../SnakeGame";
import Position from "../Position";
import { Direction, SnakeAction } from "../typing";
import Utils from "../Utils";
import { oppositeDirection } from "../oppositeDirection";
import type { IPosition } from "../Position";
import type { GameRecord, ISnakeGame } from "../SnakeGame";

const allPositionsFor3x2World = [new Position(0, 0), new Position(1, 0), new Position(2, 0), new Position(0, 1), new Position(1, 1), new Position(2, 1)];

const allPositions2DFor3x2World = [
  [new Position(0, 0), new Position(1, 0), new Position(2, 0)],
  [new Position(0, 1), new Position(1, 1), new Position(2, 1)],
];

const allPositionsFor3x3World = [
  new Position(0, 0),
  new Position(1, 0),
  new Position(2, 0),
  new Position(0, 1),
  new Position(1, 1),
  new Position(2, 1),
  new Position(0, 2),
  new Position(1, 2),
  new Position(2, 2),
];

const allPositions2DFor3x3World = [
  [new Position(0, 0), new Position(1, 0), new Position(2, 0)],
  [new Position(0, 1), new Position(1, 1), new Position(2, 1)],
  [new Position(0, 2), new Position(1, 2), new Position(2, 2)],
];

const allPositionsPlainObjectFor3x3World = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
];

const allPositions2DPlainObjectFor3x3World = [
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

describe("test suite for SnakeGame", () => {
  it("static clone test", () => {
    const snakeGame = new SnakeGame({ worldWidth: 3, worldHeight: 3 });
    const snakeGameClone = SnakeGame.clone(snakeGame);

    expect(snakeGameClone === snakeGame).toBe(false);
    expect((snakeGameClone as unknown) instanceof SnakeGame).toBe(true);
    expect(snakeGameClone).toStrictEqual(snakeGame);
  });

  it("static cloneGameRecord", () => {
    const gameRecord: GameRecord = {
      worldWidth: 10,
      worldHeight: 8,
      initialSnakePosition: { x: 3, y: 4 },
      initialSnakeDirection: Direction.UP,
      initialFoodPosition: { x: 0, y: 0 },
      moveRecord: [0, 2, 3, -1],
    };

    const clone = SnakeGame.cloneGameRecord(gameRecord);
    expect(clone).toStrictEqual(gameRecord);
    expect(clone).not.toBe(gameRecord);

    gameRecord.moveRecord[0] = 1;
    expect(clone).not.toStrictEqual(gameRecord);
  });

  it("constructor test 3x3 world", () => {
    const snakeGame = new SnakeGame({ worldWidth: 3, worldHeight: 3 });

    expect(snakeGame.worldWidth).toBe(3);
    expect(snakeGame.worldHeight).toBe(3);
    expect(snakeGame.allPositions).toStrictEqual(allPositionsFor3x3World);
    expect(snakeGame.allPositions2D).toStrictEqual(allPositions2DFor3x3World);
    expect(snakeGame.snake.length).toBe(1);
    expect(snakeGame.snake.head.isEqual(new Position(1, 1))).toBe(true);
    expect(snakeGame.food.isEqual(new Position(1, 1))).toBe(false);
    expect(snakeGame.gameOver).toBe(false);
    expect(snakeGame.moves).toBe(0);
    expect(snakeGame.movesForNoFood).toBe(0);
    expect(snakeGame.maxMovesOfNoFood).toBeGreaterThan(0);
  });

  it("constructor test for providedInitialStatus 3x3 world", () => {
    const snakePositions = [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ];

    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: snakePositions,
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });

    expect(snakeGame.worldWidth).toBe(3);
    expect(snakeGame.worldHeight).toBe(3);
    expect(snakeGame.allPositions).toStrictEqual(allPositionsFor3x3World);
    expect(snakeGame.allPositions2D).toStrictEqual(allPositions2DFor3x3World);
    expect(snakeGame.snake.positions.length).toBe(4);
    expect(snakeGame.snake.positions).toStrictEqual([new Position(1, 1), new Position(2, 1), new Position(2, 2), new Position(1, 2)]);
    expect(snakeGame.food.isEqual(new Position(0, 0))).toBe(true);
    expect(snakeGame.gameOver).toBe(false);
    expect(snakeGame.moves).toBe(10);
    expect(snakeGame.movesForNoFood).toBe(2);
    expect(snakeGame.maxMovesOfNoFood).toBeGreaterThan(0);
  });

  it("constructor test 3x2 world", () => {
    const snakeGame = new SnakeGame({ worldWidth: 3, worldHeight: 2 });

    expect(snakeGame.worldWidth).toBe(3);
    expect(snakeGame.worldHeight).toBe(2);
    expect(snakeGame.allPositions).toStrictEqual(allPositionsFor3x2World);
    expect(snakeGame.allPositions2D).toStrictEqual(allPositions2DFor3x2World);
    expect(snakeGame.snake.length).toBe(1);
    expect(snakeGame.snake.head.isEqual(new Position(1, 1))).toBe(true);
    expect(snakeGame.food.isEqual(new Position(1, 1))).toBe(false);
    expect(snakeGame.gameOver).toBe(false);
    expect(snakeGame.moves).toBe(0);
    expect(snakeGame.movesForNoFood).toBe(0);
    expect(snakeGame.maxMovesOfNoFood).toBeGreaterThan(0);
  });

  it("constructor test for providedInitialStatus 3x2 world", () => {
    const snakePositions = [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ];

    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 2,
      providedInitialStatus: {
        snake: {
          positions: snakePositions,
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });

    expect(snakeGame.worldWidth).toBe(3);
    expect(snakeGame.worldHeight).toBe(2);
    expect(snakeGame.allPositions).toStrictEqual(allPositionsFor3x2World);
    expect(snakeGame.allPositions2D).toStrictEqual(allPositions2DFor3x2World);
    expect(snakeGame.snake.positions.length).toBe(2);
    expect(snakeGame.snake.positions).toStrictEqual([new Position(1, 1), new Position(2, 1)]);
    expect(snakeGame.food.isEqual(new Position(0, 0))).toBe(true);
    expect(snakeGame.gameOver).toBe(false);
    expect(snakeGame.moves).toBe(10);
    expect(snakeGame.movesForNoFood).toBe(2);
    expect(snakeGame.maxMovesOfNoFood).toBeGreaterThan(0);
  });

  it("constructor test for invalid snake positions", () => {
    const snakePositions = [
      { x: 1, y: 1 },
      { x: 9, y: 1 },
    ];

    const fn = () =>
      new SnakeGame({
        worldWidth: 3,
        worldHeight: 3,
        providedInitialStatus: {
          snake: {
            positions: snakePositions,
            direction: Direction.LEFT,
          },
          food: { x: 0, y: 0 },
          moves: 10,
          movesForNoFood: 2,
          gameOver: false,
          initialSnakePosition: { x: 1, y: 1 },
          initialSnakeDirection: Direction.UP,
          initialFoodPosition: { x: 0, y: 0 },
          moveRecord: new Array(10).fill({ move: 0 }),
        },
      });

    expect(fn).toThrowError("Provided snake position is not valid");
  });

  it("constructor test 3x2 world", () => {
    const snakeGame = new SnakeGame({ worldWidth: 3, worldHeight: 2 });

    expect(snakeGame.worldWidth).toBe(3);
    expect(snakeGame.worldHeight).toBe(2);
    expect(snakeGame.allPositions).toStrictEqual(allPositionsFor3x2World);
    expect(snakeGame.allPositions2D).toStrictEqual(allPositions2DFor3x2World);
    expect(snakeGame.snake.length).toBe(1);
    expect(snakeGame.snake.head.isEqual(new Position(1, 1))).toBe(true);
    expect(snakeGame.food.isEqual(new Position(1, 1))).toBe(false);
    expect(snakeGame.gameOver).toBe(false);
    expect(snakeGame.moves).toBe(0);
    expect(snakeGame.movesForNoFood).toBe(0);
    expect(snakeGame.maxMovesOfNoFood).toBeGreaterThan(0);
  });

  it("toPlainObject and toPlainObjectIgnoreMoveRecordAndAllPosition test", () => {
    const snakePositions = [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ];

    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: snakePositions,
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill(0),
      },
    });
    const plainObj = snakeGame.toPlainObject();

    const expectedPlainObject: ISnakeGame = {
      worldWidth: 3,
      worldHeight: 3,
      allPositions: allPositionsPlainObjectFor3x3World,
      allPositions2D: allPositions2DPlainObjectFor3x3World,
      snake: {
        positions: snakePositions,
        direction: Direction.LEFT,
        allPositions2D: allPositions2DPlainObjectFor3x3World,
      },
      food: { x: snakeGame.food.x, y: snakeGame.food.y },
      gameOver: false,
      moves: 10,
      movesForNoFood: 2,
      maxMovesOfNoFood: snakeGame.maxMovesOfNoFood,
      initialSnakePosition: { x: 1, y: 1 },
      initialSnakeDirection: Direction.UP,
      initialFoodPosition: { x: 0, y: 0 },
      moveRecord: new Array(10).fill(0),
    };

    expect(plainObj instanceof SnakeGame).toBe(false);
    expect(plainObj).toStrictEqual(expectedPlainObject);
    expect(JSON.stringify(plainObj)).toBe(JSON.stringify(expectedPlainObject));

    const expectedPlainObjectIgnoreMoveRecordAndAllPosition: ISnakeGame = {
      ...expectedPlainObject,
      moveRecord: [],
      allPositions: [],
      allPositions2D: [],
      snake: {
        positions: snakePositions,
        direction: Direction.LEFT,
        allPositions2D: [],
      },
    };
    const plainObjIgnoreMoveRecordAndAllPosition = snakeGame.toPlainObjectIgnoreMoveRecordAndAllPosition();
    expect(plainObjIgnoreMoveRecordAndAllPosition instanceof SnakeGame).toBe(false);
    expect(plainObjIgnoreMoveRecordAndAllPosition).toStrictEqual(expectedPlainObjectIgnoreMoveRecordAndAllPosition);
    expect(JSON.stringify(plainObjIgnoreMoveRecordAndAllPosition)).toBe(JSON.stringify(expectedPlainObjectIgnoreMoveRecordAndAllPosition));
  });

  it("exportGameRecord test", () => {
    const snakeGame = new SnakeGame({ worldWidth: 10, worldHeight: 10 });
    snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_LEFT);
    snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_LEFT);
    snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_LEFT);
    snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_RIGHT);
    snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_RIGHT);
    snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_RIGHT);
    snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT);
    snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT);
    snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT);
    const exportGameRecord = snakeGame.exportGameRecord();
    const expectedExportGameRecord = {
      worldWidth: 10,
      worldHeight: 10,
      initialSnakePosition: snakeGame.initialSnakePosition,
      initialSnakeDirection: snakeGame.initialSnakeDirection,
      initialFoodPosition: snakeGame.initialFoodPosition,
      moveRecord: snakeGame.moveRecord,
    };
    expect(exportGameRecord).toStrictEqual(expectedExportGameRecord);
    exportGameRecord.initialFoodPosition.x = 999;
    expect(exportGameRecord).not.toStrictEqual(expectedExportGameRecord);
  });

  it("reset test", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
          ],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });

    snakeGame.reset();
    expect(snakeGame.worldWidth).toBe(3);
    expect(snakeGame.worldHeight).toBe(3);
    expect(snakeGame.allPositions).toStrictEqual(allPositionsFor3x3World);
    expect(snakeGame.allPositions2D).toStrictEqual(allPositions2DFor3x3World);
    expect(snakeGame.snake.positions.length).toBe(1);
    expect(snakeGame.snake.head.isEqual(new Position(1, 1))).toBe(true);
    expect(snakeGame.food.isEqual(new Position(1, 1))).toBe(false);
    expect(snakeGame.gameOver).toBe(false);
    expect(snakeGame.moves).toBe(0);
    expect(snakeGame.movesForNoFood).toBe(0);
    expect(snakeGame.maxMovesOfNoFood).toBeGreaterThan(0);
    expect(snakeGame.initialSnakePosition).toStrictEqual(snakeGame.snake.head.toPlainObject());
    expect(snakeGame.initialSnakeDirection).toBe(snakeGame.snake.direction);
    expect(snakeGame.initialFoodPosition).toStrictEqual(snakeGame.food.toPlainObject());
    expect(snakeGame.moveRecord.length).toBe(0);
  });

  it("suicide test 1", () => {
    const options = { worldWidth: 3, worldHeight: 3 };
    const snakeGame1 = new SnakeGame(options);
    snakeGame1.suicide(oppositeDirection(snakeGame1.snake.direction));
    expect(snakeGame1.moves).toBe(1);
    expect(snakeGame1.movesForNoFood).toBe(1);
    expect(snakeGame1.gameOver).toBe(true);
    expect(snakeGame1.moveRecord.length).toBe(1);
    expect(snakeGame1.moveRecord[0]).toStrictEqual(SnakeGame.directionMap[oppositeDirection(snakeGame1.snake.direction)]);

    const snakeGame2 = new SnakeGame(options);
    snakeGame2.snakeMoveBySnakeAction(SnakeAction.FRONT);
    const movesForNoFoodBeforeSuicide = snakeGame2.movesForNoFood;
    snakeGame2.suicide(oppositeDirection(snakeGame2.snake.direction));
    expect(snakeGame2.moves).toBe(2);
    expect(snakeGame2.movesForNoFood).toBe(movesForNoFoodBeforeSuicide + 1);
    expect(snakeGame2.gameOver).toBe(true);
    expect(snakeGame2.moveRecord.length).toBe(2);
    expect(snakeGame2.moveRecord[1]).toStrictEqual(SnakeGame.directionMap[oppositeDirection(snakeGame2.snake.direction)]);
  });

  it("suicide test toThrowError", () => {
    const options = { worldWidth: 3, worldHeight: 3 };
    const snakeGame = new SnakeGame(options);
    snakeGame.suicide(oppositeDirection(snakeGame.snake.direction));
    expect(snakeGame.gameOver).toBe(true);
    expect(() => snakeGame.suicide(Direction.DOWN)).toThrowError("suicide method is called when game is over");
  });

  describe("checkOutOfBounds test", () => {
    const snakeGame1 = new SnakeGame({ worldWidth: 3, worldHeight: 3 });
    const snakeGame2 = new SnakeGame({ worldWidth: 5, worldHeight: 4 });

    it.each<{ snakeGame: SnakeGame; x: number; y: number; expected: boolean }>`
      name         | snakeGame     | x     | y     | expected
      ${"test 1"}  | ${snakeGame1} | ${-1} | ${0}  | ${true}
      ${"test 2"}  | ${snakeGame1} | ${-1} | ${-1} | ${true}
      ${"test 3"}  | ${snakeGame1} | ${0}  | ${-1} | ${true}
      ${"test 4"}  | ${snakeGame1} | ${3}  | ${0}  | ${true}
      ${"test 5"}  | ${snakeGame1} | ${3}  | ${3}  | ${true}
      ${"test 6"}  | ${snakeGame1} | ${0}  | ${3}  | ${true}
      ${"test 7"}  | ${snakeGame1} | ${0}  | ${0}  | ${false}
      ${"test 8"}  | ${snakeGame1} | ${0}  | ${1}  | ${false}
      ${"test 9"}  | ${snakeGame1} | ${0}  | ${2}  | ${false}
      ${"test 10"} | ${snakeGame1} | ${1}  | ${0}  | ${false}
      ${"test 11"} | ${snakeGame1} | ${1}  | ${1}  | ${false}
      ${"test 12"} | ${snakeGame1} | ${1}  | ${2}  | ${false}
      ${"test 13"} | ${snakeGame1} | ${2}  | ${0}  | ${false}
      ${"test 14"} | ${snakeGame1} | ${2}  | ${1}  | ${false}
      ${"test 15"} | ${snakeGame1} | ${2}  | ${2}  | ${false}
      ${"test 16"} | ${snakeGame2} | ${-1} | ${0}  | ${true}
      ${"test 17"} | ${snakeGame2} | ${-1} | ${-1} | ${true}
      ${"test 18"} | ${snakeGame2} | ${0}  | ${-1} | ${true}
      ${"test 19"} | ${snakeGame2} | ${5}  | ${0}  | ${true}
      ${"test 20"} | ${snakeGame2} | ${5}  | ${4}  | ${true}
      ${"test 21"} | ${snakeGame2} | ${0}  | ${4}  | ${true}
      ${"test 22"} | ${snakeGame2} | ${0}  | ${0}  | ${false}
      ${"test 23"} | ${snakeGame2} | ${0}  | ${1}  | ${false}
      ${"test 24"} | ${snakeGame2} | ${0}  | ${2}  | ${false}
      ${"test 25"} | ${snakeGame2} | ${0}  | ${3}  | ${false}
      ${"test 26"} | ${snakeGame2} | ${1}  | ${0}  | ${false}
      ${"test 27"} | ${snakeGame2} | ${1}  | ${1}  | ${false}
      ${"test 28"} | ${snakeGame2} | ${1}  | ${2}  | ${false}
      ${"test 29"} | ${snakeGame2} | ${1}  | ${3}  | ${false}
      ${"test 30"} | ${snakeGame2} | ${2}  | ${0}  | ${false}
      ${"test 31"} | ${snakeGame2} | ${2}  | ${1}  | ${false}
      ${"test 32"} | ${snakeGame2} | ${2}  | ${2}  | ${false}
      ${"test 33"} | ${snakeGame2} | ${2}  | ${3}  | ${false}
      ${"test 34"} | ${snakeGame2} | ${3}  | ${0}  | ${false}
      ${"test 35"} | ${snakeGame2} | ${3}  | ${1}  | ${false}
      ${"test 36"} | ${snakeGame2} | ${3}  | ${2}  | ${false}
      ${"test 37"} | ${snakeGame2} | ${3}  | ${3}  | ${false}
      ${"test 38"} | ${snakeGame2} | ${4}  | ${0}  | ${false}
      ${"test 39"} | ${snakeGame2} | ${4}  | ${1}  | ${false}
      ${"test 40"} | ${snakeGame2} | ${4}  | ${2}  | ${false}
      ${"test 41"} | ${snakeGame2} | ${4}  | ${3}  | ${false}
    `("$name", ({ snakeGame, x, y, expected }) => {
      expect(snakeGame.checkOutOfBounds(new Position(x, y))).toBe(expected);
    });
  });

  describe("getRandomFoodPosition test", () => {
    const snakeGame1 = new SnakeGame({ worldWidth: 2, worldHeight: 2 });

    const snakeGame2 = new SnakeGame({
      worldWidth: 2,
      worldHeight: 2,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
          ],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });

    const snakeGame3 = new SnakeGame({ worldWidth: 2, worldHeight: 4 });

    const snakeGame4 = new SnakeGame({
      worldWidth: 3,
      worldHeight: 2,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 0 },
          ],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 3,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });

    it.skip.each<{ name: string; snakeGame: SnakeGame }>`
      name        | snakeGame
      ${"test 1"} | ${snakeGame1}
      ${"test 2"} | ${snakeGame2}
      ${"test 3"} | ${snakeGame3}
      ${"test 4"} | ${snakeGame4}
    `("$name", ({ snakeGame }) => {
      const allowAbleDiffRatio = 0.1;
      const simulateTimes = 10000;

      const allowablePositions = snakeGame.allPositions.filter((x) => !snakeGame.snake.positions.some((y) => y.isEqual(x)));
      expect(allowablePositions.length).toBe(snakeGame.allPositions.length - snakeGame.snake.positions.length);
      const countArr = new Array(allowablePositions.length).fill(0);
      for (let i = 0; i < simulateTimes; i++) {
        const foodPosition = snakeGame.getRandomFoodPosition();
        expect(snakeGame.snake.positions.some((p) => p.isEqual(foodPosition))).toBe(false);
        expect(allowablePositions.some((p) => p.isEqual(foodPosition))).toBe(true);
        countArr[allowablePositions.findIndex((p) => p.isEqual(foodPosition))]++;
      }

      const idealAvg = Math.floor(simulateTimes / allowablePositions.length);
      const lowerBound = Math.floor(idealAvg * (1 - allowAbleDiffRatio));
      const upperBound = Math.floor(idealAvg * (1 + allowAbleDiffRatio));
      for (const count of countArr) {
        expect(count).toBeGreaterThanOrEqual(lowerBound);
        expect(count).toBeLessThanOrEqual(upperBound);
      }
    });
  });

  it("snakeMoveBySnakeAction test", () => {
    for (const snakeAction of Utils.enumToArray(SnakeAction)) {
      const snakeGame = new SnakeGame({ worldWidth: 5, worldHeight: 5 });
      const getHeadPositionAndDirectionAfterMoveBySnakeActionSpy = jest.spyOn(snakeGame.snake, "getHeadPositionAndDirectionAfterMoveBySnakeAction");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- use type-casting to access the private method
      const snakeMoveSpy = jest.spyOn(snakeGame as any, "snakeMove");

      snakeGame.snakeMoveBySnakeAction(snakeAction);
      expect(getHeadPositionAndDirectionAfterMoveBySnakeActionSpy).toBeCalledWith(snakeAction);
      expect(snakeMoveSpy).toBeCalledTimes(1);
      expect(snakeGame.moveRecord.length).toBe(1);
    }
  });

  it("snakeMoveBySnakeAction test toThrowError", () => {
    const snakeGame = new SnakeGame({ worldWidth: 2, worldHeight: 2 });
    snakeGame.suicide(oppositeDirection(snakeGame.snake.direction));
    expect(() => snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT)).toThrowError("snakeMoveBySnakeAction() is called when game is over");
  });

  describe("snakeMoveByDirection and snakeMoveByDirectionWithSuicidePrevention test", () => {
    const snakeGameFactory = () =>
      new SnakeGame({
        worldWidth: 5,
        worldHeight: 5,
        providedInitialStatus: {
          snake: {
            positions: [new Position(2, 2)],
            direction: Direction.UP,
          },
          food: new Position(0, 0),
          moves: 0,
          movesForNoFood: 0,
          gameOver: false,
          initialSnakePosition: { x: 1, y: 1 },
          initialSnakeDirection: Direction.UP,
          initialFoodPosition: { x: 0, y: 0 },
          moveRecord: [],
        },
      });

    it("snakeMoveByDirection test", () => {
      const allDirection = Utils.enumToArray(Direction);

      for (const direction of allDirection) {
        const snakeGame = snakeGameFactory();

        const getHeadPositionAndDirectionAfterMoveByDirectionSpy = jest.spyOn(snakeGame.snake, "getHeadPositionAndDirectionAfterMoveByDirection");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- use type-casting to access the private method
        const snakeMoveSpy = jest.spyOn(snakeGame as any, "snakeMove");
        const suicideSpy = jest.spyOn(snakeGame, "suicide");

        snakeGame.snakeMoveByDirection(direction);

        if (direction === oppositeDirection(Direction.UP)) {
          expect(getHeadPositionAndDirectionAfterMoveByDirectionSpy).toBeCalledTimes(0);
          expect(snakeMoveSpy).toBeCalledTimes(0);
          expect(suicideSpy).toBeCalledTimes(1);
          expect(snakeGame.moveRecord.length).toBe(1);
        } else {
          expect(getHeadPositionAndDirectionAfterMoveByDirectionSpy).toBeCalledWith(direction);
          expect(snakeMoveSpy).toBeCalledTimes(1);
          expect(suicideSpy).toBeCalledTimes(0);
          expect(snakeGame.moveRecord.length).toBe(1);
        }
      }
    });

    it("snakeMoveByDirection test toThrowError", () => {
      const snakeGame = snakeGameFactory();
      snakeGame.suicide(oppositeDirection(snakeGame.snake.direction));
      expect(() => snakeGame.snakeMoveByDirection(Direction.UP)).toThrowError("snakeMoveByDirection() is called when game is over");
    });

    it("snakeMoveByDirectionWithSuicidePrevention test", () => {
      const allDirection = Utils.enumToArray(Direction);

      for (const direction of allDirection) {
        const snakeGame = snakeGameFactory();

        const getHeadPositionAndDirectionAfterMoveByDirectionSpy = jest.spyOn(snakeGame.snake, "getHeadPositionAndDirectionAfterMoveByDirection");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- use type-casting to access the private method
        const snakeMoveSpy = jest.spyOn(snakeGame as any, "snakeMove");
        const suicideSpy = jest.spyOn(snakeGame, "suicide");

        snakeGame.snakeMoveByDirectionWithSuicidePrevention(direction);

        if (direction === oppositeDirection(Direction.UP)) {
          expect(getHeadPositionAndDirectionAfterMoveByDirectionSpy).toBeCalledTimes(0);
          expect(snakeMoveSpy).toBeCalledTimes(0);
          expect(suicideSpy).toBeCalledTimes(0);
          expect(snakeGame.moveRecord.length).toBe(0);
        } else {
          expect(getHeadPositionAndDirectionAfterMoveByDirectionSpy).toBeCalledWith(direction);
          expect(snakeMoveSpy).toBeCalledTimes(1);
          expect(suicideSpy).toBeCalledTimes(0);
          expect(snakeGame.moveRecord.length).toBe(1);
        }
      }
    });

    it("snakeMoveByDirectionWithSuicidePrevention test toThrowError", () => {
      const snakeGame = new SnakeGame({ worldWidth: 2, worldHeight: 2 });
      snakeGame.suicide(snakeGame.snake.direction);
      expect(() => snakeGame.snakeMoveByDirectionWithSuicidePrevention(Direction.UP)).toThrowError("snakeMoveByDirectionWithSuicidePrevention() is called when game is over");
    });
  });

  it("snakeMoveBySnakeAction test out of bounds", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [{ x: 0, y: 0 }],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 1 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });
    snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT);
    expect(snakeGame.moves).toBe(11);
    expect(snakeGame.movesForNoFood).toBe(3);
    expect(snakeGame.gameOver).toBe(true);
  });

  it("snakeMoveBySnakeAction test eat self", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
            { x: 0, y: 2 },
          ],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });
    snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_LEFT);
    expect(snakeGame.moves).toBe(11);
    expect(snakeGame.movesForNoFood).toBe(3);
    expect(snakeGame.gameOver).toBe(true);
  });

  it("snakeMoveBySnakeAction test eat food and reach max length", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 2,
      worldHeight: 2,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
          ],
          direction: Direction.UP,
        },
        food: { x: 1, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });
    snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_RIGHT);
    expect(snakeGame.moves).toBe(11);
    expect(snakeGame.movesForNoFood).toBe(0);
    expect(snakeGame.gameOver).toBe(true);
    expect(snakeGame.snake.length).toBe(4);
  });

  it("snakeMoveBySnakeAction test exceed maxTurnOfNoFood", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [{ x: 1, y: 1 }],
          direction: Direction.UP,
        },
        food: { x: 0, y: 0 },
        moves: 999,
        movesForNoFood: 999,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(999).fill({ move: 0 }),
      },
    });
    snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT);
    expect(snakeGame.moves).toBe(1000);
    expect(snakeGame.movesForNoFood).toBe(1000);
    expect(snakeGame.gameOver).toBe(true);
    expect(snakeGame.snake.positions.length).toBe(1);
  });

  it("moveRecord test 1", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
          ],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill(0),
      },
    });

    const expectedMoveRecord: number[] = new Array(10).fill(0);

    snakeGame.snakeMoveByDirection(Direction.DOWN); // 1, 2
    expectedMoveRecord.push(1);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.LEFT); // 0, 2
    expectedMoveRecord.push(2);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.UP); // 0, 1
    expectedMoveRecord.push(0);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.RIGHT); // 1, 1
    expectedMoveRecord.push(3);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.UP); // 1, 0
    expectedMoveRecord.push(0);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.LEFT); // 0, 0 eat food
    const oneDIndex = snakeGame.to1DIndex(snakeGame.food.x, snakeGame.food.y);
    expectedMoveRecord.push((oneDIndex + 1) * 10 + 2);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.RIGHT); // suicide
    expectedMoveRecord.push(3);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);
  });

  it("moveRecord test 2", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [{ x: 1, y: 1 }],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 0,
        movesForNoFood: 0,
        gameOver: false,
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: [],
      },
    });

    snakeGame.snakeMoveByDirection(Direction.LEFT);
    snakeGame.snakeMoveByDirection(Direction.LEFT);
    expect(snakeGame.moveRecord).toStrictEqual([2, 2]);
  });

  describe("to1DIndex and to2DIndex test", () => {
    const snakeGame1 = new SnakeGame({ worldWidth: 3, worldHeight: 3 });
    const snakeGame2 = new SnakeGame({ worldWidth: 3, worldHeight: 2 });

    it.each<{ name: string; snakeGame: SnakeGame; arr1D: Position[]; arr2D: Position[][] }>`
      name        | snakeGame     | arr1D                      | arr2D
      ${"test 1"} | ${snakeGame1} | ${allPositionsFor3x3World} | ${allPositions2DFor3x3World}
      ${"test 2"} | ${snakeGame2} | ${allPositionsFor3x2World} | ${allPositions2DFor3x2World}
    `("$name", ({ snakeGame, arr1D, arr2D }) => {
      for (let i = 0; i < arr1D.length; i++) {
        const [x, y] = snakeGame.to2DIndex(i);
        expect(arr1D[i]).toStrictEqual(arr2D[x][y]);
      }
      for (let i = 0; i < arr2D.length; i++) {
        for (let j = 0; j < arr2D[i].length; j++) {
          const index = snakeGame.to1DIndex(i, j);
          expect(arr1D[index]).toStrictEqual(arr2D[i][j]);
        }
      }
    });
  });

  describe("moveRecord test", () => {
    const snakeGame = new SnakeGame({ worldWidth: 8, worldHeight: 10 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- use type-casting to access the private method
    const snakeMoveSpy = jest.spyOn(snakeGame as any, "snakeMove").mockImplementation(() => {
      // do nothing
    });

    const up = { direction: Direction.UP, position: { x: 4, y: 4 } };
    const down = { direction: Direction.DOWN, position: { x: 4, y: 6 } };
    const left = { direction: Direction.LEFT, position: { x: 3, y: 5 } };
    const right = { direction: Direction.RIGHT, position: { x: 5, y: 5 } };

    it.each<{ name: string; moveRecord: number; posAndDir: { direction: Direction; position: IPosition }; foodPos: IPosition | null }>`
      name         | moveRecord | posAndDir | foodPos
      ${"test 1"}  | ${0}       | ${up}     | ${null}
      ${"test 2"}  | ${1}       | ${down}   | ${null}
      ${"test 3"}  | ${2}       | ${left}   | ${null}
      ${"test 4"}  | ${3}       | ${right}  | ${null}
      ${"test 5"}  | ${10}      | ${up}     | ${{ x: 0, y: 0 }}
      ${"test 6"}  | ${11}      | ${down}   | ${{ x: 0, y: 0 }}
      ${"test 7"}  | ${12}      | ${left}   | ${{ x: 0, y: 0 }}
      ${"test 8"}  | ${13}      | ${right}  | ${{ x: 0, y: 0 }}
      ${"test 9"}  | ${222}     | ${left}   | ${{ x: 5, y: 2 }}
      ${"test 10"} | ${300}     | ${up}     | ${{ x: 5, y: 3 }}
      ${"test 10"} | ${470}     | ${up}     | ${{ x: 6, y: 5 }}
      ${"test 10"} | ${471}     | ${down}   | ${{ x: 6, y: 5 }}
      ${"test 11"} | ${472}     | ${left}   | ${{ x: 6, y: 5 }}
      ${"test 12"} | ${473}     | ${right}  | ${{ x: 6, y: 5 }}
      ${"test 13"} | ${693}     | ${right}  | ${{ x: 4, y: 8 }}
      ${"test 13"} | ${791}     | ${down}   | ${{ x: 6, y: 9 }}
    `("$name", ({ moveRecord, posAndDir, foodPos }) => {
      snakeGame.replayMove(moveRecord);
      if (!foodPos) {
        expect(snakeMoveSpy).lastCalledWith(posAndDir);
      } else {
        expect(snakeMoveSpy).lastCalledWith(posAndDir, foodPos);
      }
    });
  });

  it("moveRecord test to throw", () => {
    const snakeGame = new SnakeGame({ worldWidth: 10, worldHeight: 10 });
    expect(() => snakeGame.replayMove(4)).toThrow("moveRecord's direction is not from 0-3");
    expect(() => snakeGame.replayMove(9)).toThrow("moveRecord's direction is not from 0-3");
  });

  it("moveRecord test to throw", () => {
    const snakeGame = new SnakeGame({ worldWidth: 2, worldHeight: 2 });
    expect(() => snakeGame.replayMove(99990)).toThrow("providedFoodPosition is not valid");
  });
});
